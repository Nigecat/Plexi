#define NAPI_CPP_EXCEPTIONS
#include <napi.h>
#include <string>
#include "image/image.h"

using namespace Napi;
using std::string;

void manipulate_image(const CallbackInfo& info)
{
    Env env = info.Env();

    string input = string(info[0].ToString());
    string output = string(info[1].ToString());
    int contrast = info[2].ToNumber();

    Image image;
    image.init(input.c_str());
    image.contrast(contrast);
    image.save(output.c_str());
}

Object Init(Env env, Object exports)
{
    exports.Set(String::New(env, "manipulateImage"), Function::New<manipulate_image>(env));
    return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
