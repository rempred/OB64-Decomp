#ifndef OB64_GAME_BATTLE_IMAGE_RECORD_H
#define OB64_GAME_BATTLE_IMAGE_RECORD_H

/* Texture header consumed by the battle image renderer; pixels begin at +8. */
typedef struct BattleImageRecord {
    unsigned char pad0[3];
    unsigned char siz;
    unsigned short w, h;
    unsigned char data[1];
} BattleImageRecord;

void func_00240964(BattleImageRecord *image, signed short x, signed short y);
#endif
