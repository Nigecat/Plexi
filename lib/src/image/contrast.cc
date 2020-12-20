#include "image.h"

void Image::contrast(int adjustment)
{
    int factor = (259 * (adjustment + 255)) / (255 * (259 - adjustment));

    // Iterate over the pixels
    for (int x = 0; x < width; x++)
    {
        for (int y = 0; y < height; y++)
        {
            Pixel pixel = get_pixel(x, y);
            int red = truncate(factor * (pixel.red - 128) + 128);
            int green = truncate(factor * (pixel.green - 128) + 128);
            int blue = truncate(factor * (pixel.blue - 128) + 128);
            replace_pixel(Pixel { red, green, blue, pixel.alpha }, x, y);
        }
    }
}