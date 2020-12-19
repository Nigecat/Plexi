#define NAPI_CPP_EXCEPTIONS
#include <napi.h>

using namespace Napi;

Value Fn(const CallbackInfo& info)
{
    Env env = info.Env();
    // ...
    return String::New(env, "Hello, World!");
}

Object Init(Env env, Object exports)
{
    exports.Set(String::New(env, "fn"), Function::New<Fn>(env));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
