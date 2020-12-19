#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#define RGBA_CHANNELS 4

#include <vector>
#include <iostream>
#include "../vendor/stb_image.h"
#include "../vendor/stb_image_write.h"
#include "image.h"

std::ostream &operator << (std::ostream &os, const Pixel &pixel)
{
    os << "Pixel (" << pixel.red << ", " << pixel.green << ", " << pixel.blue << ", " << pixel.alpha << ")";
    return os;
}

bool Image::init(char const *file)
{
    unsigned char *raw_data = stbi_load(file, &width, &height, &channels, RGBA_CHANNELS);
    if (raw_data != nullptr)
    {
        data = std::vector<unsigned char>(raw_data, raw_data + width * height * RGBA_CHANNELS);
    }
    stbi_image_free(raw_data);
    return (raw_data != nullptr);
}

Pixel Image::get_pixel(int x, int y)
{
    size_t index = calculate_index(x, y);
    return Pixel {
        static_cast<int>(data[index + 0]),
        static_cast<int>(data[index + 1]),
        static_cast<int>(data[index + 2]),
        static_cast<int>(data[index + 3]),
    };
}

void Image::replace_pixel(Pixel pixel, int x, int y)
{
    size_t index = calculate_index(x, y);
    data[index + 0] = static_cast<unsigned char>(pixel.red);
    data[index + 1] = static_cast<unsigned char>(pixel.green);
    data[index + 2] = static_cast<unsigned char>(pixel.blue);
    data[index + 3] = static_cast<unsigned char>(pixel.alpha);
}

void Image::save(char const *path)
{
    unsigned char* raw_data = &data[0];
    stbi_write_jpg(path, width, height, channels, raw_data, width * channels);
}

size_t Image::calculate_index(int x, int y)
{
    return RGBA_CHANNELS * (y * width + x);
}

int Image::truncate(int num)
{
    if (num < 0) return 0;
    else if (num > 255) return 255;
    else return num;
}

void Image::contrast(int adjustment)
{
    int factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    // Iterate over the pixels
    for (int x = 0; x < width; x++)
    {
        for (int y = 0; y < height; y++)
        {
           // printf("Currently at position: (%i, %i) with ", x, y);
           // std::cout << pixel << "\n";

            Pixel pixel = get_pixel(x, y);
            int red = truncate(factor * (pixel.red - 128) + 128);
            int green = truncate(factor * (pixel.green - 128) + 128);
            int blue = truncate(factor * (pixel.blue - 128) + 128);
            replace_pixel(Pixel { red, green, blue, pixel.alpha }, x, y);
        }
    }
}
