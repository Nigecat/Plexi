#include <vector>
#include <iostream>
#include "contrast.h"
// Move this to lib.cc
#define STB_IMAGE_IMPLEMENTATION
#include "../vendor/stb_image.h"
// Also move this to lib.cc
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "../vendor/stb_image_write.h"

#define RGBA_CHANNELS 4

// Load an image as RGBA, even if it is only RGB
bool load_image(std::vector<unsigned char> &image, char const *file, int &width, int &height)
{
    int channels;
    unsigned char *data = stbi_load(file, &width, &height, &channels, RGBA_CHANNELS);
    if (data != nullptr)
    {
        image = std::vector<unsigned char>(data, data + width * height * RGBA_CHANNELS);
    }
    stbi_image_free(data);
    return (data != nullptr);
}

struct Pixel 
{
    // Red channel
    int r;
    // Green channel
    int g;
    // Blue channel
    int b;
    // Alpha channel
    int a;
};

Pixel get_pixel(std::vector<unsigned char> &image, int width, int height, int x, int y) 
{
    size_t index = RGBA_CHANNELS * (y * width + x);
    return Pixel {
        static_cast<int>(image[index + 0]),
        static_cast<int>(image[index + 1]),
        static_cast<int>(image[index + 2]),
        static_cast<int>(image[index + 3]),
    };
}

std::ostream &operator << (std::ostream &os, const Pixel &pixel)
{
    os << "Pixel (" << pixel.r << ", " << pixel.g << ", " << pixel.b << ", " << pixel.a << ")";
    return os;
}

int main()
{
    char const *file = "K:/Meme Formats/stonks.png";
    char const *output = "test.jpg";


    int width, height;
    std::vector<unsigned char> image;

    bool success = load_image(image, file, width, height);
    if (!success) 
    {
        printf("Failed to load image data (maybe the file doesn't exist)");
        return 1;
    }

    printf("Loaded image with width: %i, height: %i\n", width, height);

    std::cout << get_pixel(image, width, height, 3, 4);

    return 0;
}