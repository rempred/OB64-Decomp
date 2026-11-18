#ifndef OB64_GAME_CHAPTER_CARD_H
#define OB64_GAME_CHAPTER_CARD_H

#include "common/types.h"

/* Shared view of D_8023DE20. The reveal code uses additional fields
 * in the reserved ranges.
 */
typedef struct TitleImageHeader {
    u8 pad00[4];
    u16 width;
    u16 height;
} TitleImageHeader;

typedef struct ChapterCard {
    TitleImageHeader *secondary[5];
    TitleImageHeader *images[5];
    u8 pad28[2];
    s16 x;
    u8 pad2C[8];
    s16 y;
    u8 pad36[8];
    u16 fadeStep;
    u8 pad40[8];
    u16 alpha;
    u8 pad4A[8];
    u16 fadeTicks;
    u8 pad54[7];
    u8 secondaryCount;
} ChapterCard;

extern ChapterCard *D_8023DE20;

#endif
