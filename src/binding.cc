// Copyright 2012 Karl Skomski MIT

#include <stdio.h>
#include "sosemanuk.h"
#include <node_buffer.h>

namespace nodesosemanuk {
  using v8::Object;
  using v8::Handle;
  using v8::Local;
  using v8::Persistent;
  using v8::Value;
  using v8::HandleScope;
  using v8::FunctionTemplate;
  using v8::ObjectTemplate;
  using v8::String;
  using v8::Array;
  using v8::Function;
  using v8::TryCatch;
  using v8::Context;
  using v8::Arguments;
  using v8::Integer;
  using v8::Exception;
  using v8::Undefined;
  using v8::External;
  using v8::Null;

  static void WeakCallback (v8::Persistent<v8::Value> value, void *data) {
    sosemanuk_run_context *run_context = static_cast<sosemanuk_run_context*>(data);
    delete run_context;
  }

  v8::Handle<v8::Value> EncryptSync(const v8::Arguments& args) {
    v8::HandleScope scope;

    if (args.Length() < 1) {
      ThrowException(Exception::Error(String::New("args.length != 1")));
      return scope.Close(Undefined());
    }

    if (!node::Buffer::HasInstance(args[0])) {
      ThrowException(Exception::Error(String::New("args[0] != type(Buffer)")));
      return scope.Close(Undefined());
    }

    sosemanuk_run_context *run_context = static_cast<sosemanuk_run_context*>(
        args.This()->GetPointerFromInternalField(0));

    v8::Local<v8::Object> input_buffer = args[0]->ToObject();

    size_t input_length = node::Buffer::Length(input_buffer);
    const char* input_data = node::Buffer::Data(input_buffer);

    node::Buffer* output_buffer = node::Buffer::New(input_length);

    const char* output_data = node::Buffer::Data(output_buffer);

    sosemanuk_encrypt(
        run_context,
        (unsigned char*)input_data,
        (unsigned char*)output_data,
        input_length);

    return scope.Close(output_buffer->handle_);
  }

  struct EncryptRequest {
    const char* input_data;
    size_t input_length;
    const char* output_data;
    sosemanuk_run_context* run_context;
    Handle<Object> output_buffer_handle;
    Persistent<Function> callback;
  };

  void EncryptWork(uv_work_t *job) {
    EncryptRequest *req = static_cast<EncryptRequest*>(job->data);

    sosemanuk_encrypt(
        req->run_context,
        (unsigned char*)req->input_data,
        (unsigned char*)req->output_data,
        req->input_length);
  }

  void EncryptDone(uv_work_t *job) {
    v8::HandleScope scope;

    EncryptRequest *req = static_cast<EncryptRequest*>(job->data);

    v8::Handle<v8::Value> argv[2] = {
      v8::Null(), req->output_buffer_handle
    };

    v8::TryCatch try_catch;
    req->callback->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    if (try_catch.HasCaught()) node::FatalException(try_catch);

    req->callback.Dispose();
    delete req;
    delete job;
  }

  Handle<Value> Encrypt(const v8::Arguments& args) {
    HandleScope scope;

    Persistent<Function> callback = Persistent<Function>::New(
      Local<Function>::Cast(args[1]));

    if (args.Length() < 2) {
      Handle<Value> argv[2] = {
        Exception::Error(String::New("args.length != 2")), Null()
      };
      TryCatch try_catch;
      callback->Call(Context::GetCurrent()->Global(), 2, argv);
      if (try_catch.HasCaught()) node::FatalException(try_catch);
      return scope.Close(Undefined());
    }

    if (!node::Buffer::HasInstance(args[0])) {
      Handle<Value> argv[2] = {
        Exception::Error(String::New("args[0] != type(Buffer)")), Null()
      };
      TryCatch try_catch;
      callback->Call(v8::Context::GetCurrent()->Global(), 2, argv);
      if (try_catch.HasCaught()) node::FatalException(try_catch);
      return scope.Close(Undefined());
    }

    EncryptRequest *req = new EncryptRequest;
    sosemanuk_run_context *run_context = static_cast<sosemanuk_run_context*>(
        args.This()->GetPointerFromInternalField(0));
    req->run_context = run_context;

    Local<Object> key = args[0]->ToObject();

    req->input_length = node::Buffer::Length(key);
    req->input_data = node::Buffer::Data(key);

    node::Buffer* output_buffer = node::Buffer::New(req->input_length);
    req->output_buffer_handle = output_buffer->handle_;
    req->output_data = node::Buffer::Data(output_buffer);

    req->callback = callback;

    uv_work_t *job = new uv_work_t;
    job->data = req;
    uv_queue_work(uv_default_loop(), job, EncryptWork, EncryptDone);

    return scope.Close(Undefined());
  }

  v8::Handle<v8::Value> InitSync(const v8::Arguments& args) {
    v8::HandleScope scope;

    v8::Local<v8::Object> key = args[0]->ToObject();

    size_t key_length = node::Buffer::Length(key);
    const char* key_data = node::Buffer::Data(key);

    v8::Local<v8::Object> iv = args[1]->ToObject();

    size_t iv_length = node::Buffer::Length(iv);
    const char* iv_data = node::Buffer::Data(iv);

    sosemanuk_key_context key_context;
    sosemanuk_run_context* run_context = new sosemanuk_run_context;

    sosemanuk_schedule(
        &key_context,
        (unsigned char*)key_data,
        key_length);
    sosemanuk_init(
        run_context,
        &key_context,
        (unsigned char*)iv_data,
        iv_length);

    v8::Local<v8::ObjectTemplate> objectTemplate = ObjectTemplate::New();
    objectTemplate->SetInternalFieldCount(1);

    Persistent<Object> ret = Persistent<Object>::New(objectTemplate->NewInstance());
    ret.MakeWeak(run_context, WeakCallback);

    ret->SetPointerInInternalField(0, run_context);
    ret->Set(String::New("encrypt"), FunctionTemplate::New(Encrypt)->GetFunction());
    ret->Set(String::New("encryptSync"), FunctionTemplate::New(EncryptSync)->GetFunction());

    return scope.Close(ret);
  }

  struct InitRequest {
    const char* key_data;
    size_t key_length;
    const char* iv_data;
    size_t iv_length;
    sosemanuk_run_context* run_context;
    v8::Persistent<v8::Function> callback;
  };

  void InitWork(uv_work_t *job) {
    InitRequest *req = static_cast<InitRequest*>(job->data);

    sosemanuk_key_context key_context;
    req->run_context = new sosemanuk_run_context;

    sosemanuk_schedule(
        &key_context,
        (unsigned char*)req->key_data,
        req->key_length);
    sosemanuk_init(
        req->run_context,
        &key_context,
        (unsigned char*)req->iv_data,
        req->iv_length);
  }

  void InitDone(uv_work_t *job) {
    v8::HandleScope scope;

    InitRequest *req = static_cast<InitRequest*>(job->data);

    v8::Local<v8::ObjectTemplate> objectTemplate = ObjectTemplate::New();
    objectTemplate->SetInternalFieldCount(1);

    Persistent<Object> ret = Persistent<Object>::New(objectTemplate->NewInstance());
    ret.MakeWeak(req->run_context, WeakCallback);

    ret->SetPointerInInternalField(0, req->run_context);
    ret->Set(String::New("encrypt"), FunctionTemplate::New(Encrypt)->GetFunction());

    v8::Handle<v8::Value> argv[2] = {
      v8::Null(), ret
    };

    v8::TryCatch try_catch;
    req->callback->Call(v8::Context::GetCurrent()->Global(), 2, argv);
    if (try_catch.HasCaught()) node::FatalException(try_catch);

    req->callback.Dispose();
    delete req;
    delete job;
  }

  Handle<Value> Init(const v8::Arguments& args) {
    HandleScope scope;

    InitRequest *req = new InitRequest;

    Local<Object> key = args[0]->ToObject();

    req->key_length = node::Buffer::Length(key);
    req->key_data = node::Buffer::Data(key);

    Local<Object> iv = args[1]->ToObject();

    req->iv_length = node::Buffer::Length(iv);
    req->iv_data = node::Buffer::Data(iv);

    req->callback = Persistent<Function>::New(
      Local<Function>::Cast(args[2]));

    uv_work_t *job = new uv_work_t;
    job->data = req;
    uv_queue_work(uv_default_loop(), job, InitWork, InitDone);

    return scope.Close(Undefined());
  }

  void Init(Handle<Object> target) {
    target->Set(v8::String::NewSymbol("init"),
      FunctionTemplate::New(Init)->GetFunction());
    target->Set(String::NewSymbol("initSync"),
      FunctionTemplate::New(InitSync)->GetFunction());
  }

  NODE_MODULE(binding, Init)
}
