#include "game/framebuffer_list.h"

void set_byte_800f918d(unsigned char value)
{
    *(signed char *)0x800E918D = value;
}
