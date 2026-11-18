#include "game/chapter_card.h"

extern u16 D_8018F1A0;
extern void func_00289ECC(void);
extern void func_00287A4C(void);

void func_0028A678(void)
{
    /* KMC must keep the second countdown load inside the active fade. */
    volatile ChapterCard *card = D_8023DE20;

    if (card->fadeTicks != 0) {
        u16 alpha = card->alpha;
        u16 ticks = card->fadeTicks - 1;
        u16 step = card->fadeStep;

        card->alpha = alpha + step;
        card->fadeTicks = ticks;
    }

    func_00289ECC();
    if (D_8018F1A0 - 1073 == 5) {
        func_00287A4C();
    }
}
