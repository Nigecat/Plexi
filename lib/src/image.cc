#include <vector>
#include <iostream>
// Move this main file
#define STB_IMAGE_IMPLEMENTATION
#include "../vendor/stb_image.h"
// Also move this main file
#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "../vendor/stb_image_write.h"

#define RGBA_CHANNELS 4

// Load an image as RGBA, even if it is only RGB
bool load_image(std::vector<unsigned char> &image, char const *file, int &width, int &height, int &channels)
{
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
    int red;
    // Green channel
    int green;
    // Blue channel
    int blue;
    // Alpha channel
    int alpha;
};

// Ensure a number is within the range of 0 to 255
int truncate(int num)
{
    if (num < 0)
    {
        return 0;
    }
    else if (num > 255)
    {
        return 255;
    }
    else
    {
        return num;
    }
}

size_t calculate_index(int x, int y, int width)
{
    return RGBA_CHANNELS * (y * width + x);
}

// Get a pixel at (x, y) from an image
Pixel get_pixel(std::vector<unsigned char> &image, int width, int x, int y) 
{
    size_t index = calculate_index(x, y, width);
    return Pixel {
        static_cast<int>(image[index + 0]),
        static_cast<int>(image[index + 1]),
        static_cast<int>(image[index + 2]),
        static_cast<int>(image[index + 3]),
    };
}

// Replace a pixel at (x, y) in the source image
void replace_pixel(std::vector<unsigned char> &image, Pixel pixel, int width, int x, int y)
{
    size_t index = calculate_index(x, y, width);
    image[index + 0] = static_cast<unsigned char>(pixel.red);
    image[index + 1] = static_cast<unsigned char>(pixel.green);
    image[index + 2] = static_cast<unsigned char>(pixel.blue);
    image[index + 3] = static_cast<unsigned char>(pixel.alpha);
}

std::ostream &operator << (std::ostream &os, const Pixel &pixel)
{
    os << "Pixel (" << pixel.red << ", " << pixel.green << ", " << pixel.blue << ", " << pixel.alpha << ")";
    return os;
}

int main()
{
    char const *file = "W:/Meme-Formats/stonks.png";
    char const *output = "test.jpg";


    int width, height, channels;
    std::vector<unsigned char> image;

    bool success = load_image(image, file, width, height, channels);
    if (!success) 
    {
        printf("Failed to load image data (maybe the file doesn't exist)");
        return 1;
    }

    int adjustment = 400;
    int factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    for (int x = 0; x < width; x++)
    {
        for (int y = 0; y < height; y++)
        {
            Pixel pixel = get_pixel(image, width, x, y);
            int red = truncate(factor * (pixel.red - 128) + 128);
            int green = truncate(factor * (pixel.green - 128) + 128);
            int blue = truncate(factor * (pixel.blue - 128) + 128);
            replace_pixel(image, Pixel { red, green, blue, pixel.alpha }, width, x, y);

           
           // printf("Currently at position: (%i, %i) with ", x, y);
           // std::cout << pixel << "\n";
        }
    }

    unsigned char* data = &image[0];
    stbi_write_jpg(output, width, height, channels, data, width * channels);

    return 0;
}