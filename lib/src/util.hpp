#ifndef UTIL_H
#define UTIL_H
#include <vector>

#define __max(a,b)  (((a) > (b)) ? (a) : (b))
#define __min(a,b)  (((a) < (b)) ? (a) : (b))

namespace Util
{
    /// Generate pseudo-random numbers
    std::vector<int> random(int min, int max, int amount);
}

#endif