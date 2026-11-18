#ifndef OB64_GAME_CHAPTER_CARD_H
#define OB64_GAME_CHAPTER_CARD_H

#include "common/types.h"
#include "game/combat_draw_commands.h"

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

extern TitleImageHeader *D_8023DE10;
extern TitleImageHeader *D_8023DE14;
extern TitleImageHeader *D_8023E594;
extern TitleImageHeader *D_8023E598;
extern TitleImageHeader *D_8023E59C;

extern CombatDrawCommand D_8022AA40[];
extern CombatDrawCommand *volatile gTitleCardDisplayListCursor;

void func_002893E4(void);
void func_00289558(void);
void func_00289504(void);

#endif
