{
    "targets": [
        {
            "target_name": "lib",
            "sources": [
                "src/lib.cc",
                "src/image/image.cc",
                "src/image/contrast.cc",
                "src/image/posterize.cc",
                "src/util.cc"
            ],
            "include_dirs": [
                "<!(node -p \"require('node-addon-api').include_dir\")",
                "./",
                "./src"
            ],
            "cflags!": ["-fno-exceptions"],
            "cflags_cc!": ["-fno-exceptions"],
            "xcode_settings": {
                "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
                "CLANG_CXX_LIBRARY": "libc++",
                "MACOSX_DEPLOYMENT_TARGET": "10.7"
            },
            "msvs_settings": {
                "VCCLCompilerTool": {
                    "ExceptionHandling": 1
                },
            },
        }
    ]
}
