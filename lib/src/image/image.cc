#define STB_IMAGE_IMPLEMENTATION
#define STB_IMAGE_WRITE_IMPLEMENTATION
#define RGBA_CHANNELS 4

#include <vector>
#include <iostream>
#include <vendor/stb_image.h>
#include <vendor/stb_image_write.h>
#include "image.hpp"

std::ostream &operator << (std::ostream &os, const Pixel &pixel)
{
    os << "Pixel (" << pixel.red << ", " << pixel.green << ", " << pixel.blue << ", " << pixel.alpha << ")";
    return os;
}

bool Image::init(char const *file)
{
    unsigned char *raw_data = stbi_load(file, &this->width, &this->height, &this->channels, RGBA_CHANNELS);
    if (raw_data != nullptr)
    {
        this->data = std::vector<unsigned char>(raw_data, raw_data + this->width * this->height * RGBA_CHANNELS);
    }
    stbi_image_free(raw_data);
    return (raw_data != nullptr);
}

Pixel Image::get_pixel(int x, int y)
{
    size_t index = calculate_index(x, y);
    return Pixel {
        static_cast<int>(this->data[index + 0]),
        static_cast<int>(this->data[index + 1]),
        static_cast<int>(this->data[index + 2]),
        static_cast<int>(this->data[index + 3]),
    };
}

void Image::replace_pixel(Pixel pixel, int x, int y)
{
    size_t index = calculate_index(x, y);
    this->data[index + 0] = static_cast<unsigned char>(pixel.red);
    this->data[index + 1] = static_cast<unsigned char>(pixel.green);
    this->data[index + 2] = static_cast<unsigned char>(pixel.blue);
    this->data[index + 3] = static_cast<unsigned char>(pixel.alpha);
}

void Image::save(char const *path)
{
    unsigned char* raw_data = &this->data[0];
    stbi_write_jpg(path, this->width, this->height,this-> channels, raw_data, this->width * this->channels);
}

size_t Image::calculate_index(int x, int y)
{
    return RGBA_CHANNELS * (y * this->width + x);
}

int Image::truncate(int num)
{
    if (num < 0) return 0;
    else if (num > 255) return 255;
    else return num;
}
