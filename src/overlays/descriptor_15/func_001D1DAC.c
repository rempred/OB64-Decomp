typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    void *data;
    s16 x;
    s16 y;
    u8 unk08[0x1C];
} Slot1CE;
extern Slot1CE *D_801B80C0;
extern u16 D_800E8700;
extern u16 D_800E8100;
extern u8 g_func_0015DF10_match[];
extern u8 D_800EB0B0[];
extern s32 D_800E9C0A;
extern void *D_801B80D8[];
extern u32 D_801BA53C;
extern u8 D_801BA545;
extern s32 D_801BA6EC;
extern s32 D_801BA6F0;
void D_800EA604(void *ch, s32 sound);
void D_800EA7E4(void *ch, s32 v);
void D_800EA8CC(s32 v);
void func_001D1DAC(void) {
    Slot1CE *t = D_801B80C0;
    s16 *mode = (s16 *)((u8 *)t + 0x220);
    u8 *flags = (u8 *)&t[14].x;
    u8 *opt;
    s32 i;
    if (D_800E8700 & 0x800) {
        mode[1] -= 14;
        if (mode[1] < 0x8C) {
            mode[1] = mode[2] * 14 + 0x8C;
        }
        D_800EA604(D_801B80D8[D_801BA53C], 6);
        D_801BA53C++;
        if (D_801BA53C >= 2) {
            D_801BA53C = 0;
        }
        D_801BA6F0 = 0;
    }
    if (D_800E8700 & 0x400) {
        mode[1] += 14;
        if (mode[1] > mode[2] * 14 + 0x8C) {
            mode[1] = 0x8C;
        }
        D_800EA604(D_801B80D8[D_801BA53C], 6);
        D_801BA53C++;
        if (D_801BA53C >= 2) {
            D_801BA53C = 0;
        }
        D_801BA6F0 = 0;
    }
    *flags = 1 << ((mode[1] - 0x8C) / 14);
    if (*flags >> mode[2]) {
        if (D_800E8700 & 0x8300) {
            opt = (u8 *)&D_800E9C0A + 7;
            *opt ^= 1;
            D_800EA8CC(*opt == 0);
            D_800EA604(D_801B80D8[D_801BA53C], 6);
            D_801BA53C++;
            if (D_801BA53C >= 2) {
                D_801BA53C = 0;
            }
        }
    } else if (D_800E8100 & 0x9000) {
        D_800EA604(g_func_0015DF10_match, 0);
        D_800EA7E4(D_800EB0B0, 0x1E);
        for (i = 0; i < 3; i++) {
            if ((*flags >> i) & 1) {
                break;
            }
        }
        D_801BA545 = i + 1;
        if (mode[2] == 2 && D_801BA545 == mode[2]) {
            D_801BA545 = 3;
        }
        D_801BA6F0 = 0;
        D_801BA6EC++;
    }
}
extern s32 D_800E9C0A;
