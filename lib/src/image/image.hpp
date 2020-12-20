#ifndef IMAGE_H
#define IMAGE_H
#include <vector>
#include <iostream>

struct Pixel 
{
    int red;
    int green;
    int blue;
    int alpha;
};

std::ostream &operator << (std::ostream &os, const Pixel &pixel);

class Image
{
private:
    /// The number of colour channels in this image
    int channels;

    /// The raw pixel data of this image
    std::vector<unsigned char> data;


    /// Calculate the index of a position in the raw data
    size_t calculate_index(int x, int y);

    /// Ensure a number is within the range of 0 to 255
    static int truncate(int num);

public:
    /// The width of this image
    int width;

    /// The height of this image
    int height;


    /// Init the image object from disk
    bool init(char const *file);

    /// Get the pixel at (x, y)
    Pixel get_pixel(int x, int y);

    /// Replace the pixel at (x, y)
    void replace_pixel(Pixel pixel, int x, int y);

    /// Save this image to disk
    void save(char const *path);

    /// Adjust the contrast of this image
    void contrast(int adjustment);

    /// Posterize this image
    void posterize(int num_colours);
};

#endif