#include "common/types.h"

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
extern u16 D_8018F1A0;
extern void func_00289ECC(void);
extern void func_00287A4C(void);

void func_0028A678(void)
{
    ChapterCard *card = D_8023DE20;

    if (card->fadeTicks != 0) {
        u16 alpha = card->alpha;
        u16 ticks = card->fadeTicks;
        u16 step = card->fadeStep;

        card->alpha = alpha + step;
        card->fadeTicks = ticks - 1;
    }

    func_00289ECC();
    if (D_8018F1A0 - 1073 == 5) {
        func_00287A4C();
    }
}
