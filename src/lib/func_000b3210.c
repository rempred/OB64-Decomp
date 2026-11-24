typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u16 v[3];
} Cursor3;
typedef struct {
    s32 n;
    s32 unk4;
    s32 x;
    s32 y;
} Bob87;
typedef struct {
    u8 unk0000[0x92];
    u8 b92;
    u8 b93;
    u8 b94;
    u8 b95;
    u8 b96;
    u8 unk0097;
    u8 b98;
    u8 unk0099[0xD];
    u16 sp;
    Cursor3 stack[20];
    Cursor3 cur;
    u8 unk0126[6];
    u16 h12C;
    u8 unk012E[0xF76];
    Bob87 bob[8];
    u8 unk1124[0x5C];
    u8 rows[1][0x36];
} Menu87;
extern Menu87 *D_80196AF8;
void func_000b3210(s32 sq) {
    u8 *p = (u8 *)D_80196AF8 + (sq * 0x36 + 0x117C);
    u8 *q;
    s32 i;
    for (i = 0; i < 15; i++) {
        (p + i)[0xE] = (i < 9) ? 0xF : 0;
    }
    for (i = 0; i < 9; i++) {
        if (p[i + 4] != 0xFF && (*(u8 *)((u8 *)((u8 *)D_80196AF8 + (p[i + 4] << 1)) + (0x1873))) == 3) {
            p[i + 0xE] = 0xF;
            if (i < 6) {
                p[i + 0x17] |= 3;
                switch (i % 3) {
                    case 0:
                        p[i + 0x18] |= 1;
                        p[i + 0xF] |= 5;
                        break;
                    case 1:
                        p[i + 0x18] |= 1;
                        p[i + 0x16] |= 2;
                        p[i + 0xD] |= 0xA;
                        p[i + 0xF] |= 5;
                        break;
                    case 2:
                        p[i + 0x16] |= 2;
                        p[i + 0xD] |= 0xA;
                        break;
                }
            }
            if (i >= 3) {
                p[i + 0xB] &= 3;
                switch (i % 3) {
                    case 0:
                        p[i + 0xC] &= 0xB;
                        break;
                    case 1:
                        p[i + 0xC] &= 0xB;
                        p[i + 0xA] &= 7;
                        break;
                    case 2:
                        p[i + 0xA] &= 7;
                        break;
                }
            }
        }
    }
}
