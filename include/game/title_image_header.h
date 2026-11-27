#ifndef OB64_GAME_TITLE_IMAGE_HEADER_H
#define OB64_GAME_TITLE_IMAGE_HEADER_H

#include "common/types.h"

typedef struct TitleImageHeader {
    u8 pad00[3];
    u8 field03;
    u16 width;
    u16 height;
    u8 pixels[0];
} TitleImageHeader;

#endif
