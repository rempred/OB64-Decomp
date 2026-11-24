typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_801F0CB0[];
typedef struct {
    u8 unk00[0x11];
    u8 cls;
    u8 baseCls;
    u8 level;
    u8 gender;
    u16 maxHp;
    u16 hp;
    u8 element;
    u8 alignment;
    u16 str;
    u16 vit;
    u16 intl;
    u16 men;
    u16 agi;
    u16 dex;
    u8 luck;
    u16 items[4];
    u8 fatigue;
    u8 status;
} Character;
typedef struct {
    Character c;
    u8 unk34[4];
} Player132;
extern Player132 D_80193BC0_copy[];
extern Character D_80195560_copy[];
extern s32 D_801EB2E0;
extern u8 D_801F0C3C[];
extern s32 D_801F367C;
void func_00133490(u8 *u, s32 r);
s32 func_00133700(u8 *u);
s32 func_00133944(void *u);
void func_00133234(void) {
    s32 i;
    u8 *u;
    s32 r;
    for (i = D_801EB2E0; i < D_801EB2E0 + 10; i++) {
        if (i >= 200) {
            break;
        }
        if (D_801F0C3C[i - 100] == 0) {
            if (i < 100) {
                if (D_80193BC0_copy[i].c.fatigue >= 4) {
                    D_80193BC0_copy[i].c.fatigue -= 4;
                } else {
                    D_80193BC0_copy[i].c.fatigue = 0;
                }
                if (D_80193BC0_copy[i].c.maxHp >= D_80193BC0_copy[i].c.hp + 4) {
                    D_80193BC0_copy[i].c.hp += 4;
                } else {
                    D_80193BC0_copy[i].c.hp = D_80193BC0_copy[i].c.maxHp;
                }
            } else {
                if (D_80195560_copy[i - 100].fatigue >= 4) {
                    D_80195560_copy[i - 100].fatigue -= 4;
                } else {
                    D_80195560_copy[i - 100].fatigue = 0;
                }
                if (D_80195560_copy[i - 100].maxHp >= D_80195560_copy[i - 100].hp + 4) {
                    D_80195560_copy[i - 100].hp += 4;
                } else {
                    D_80195560_copy[i - 100].hp = D_80195560_copy[i - 100].maxHp;
                }
            }
        }
    }
    D_801EB2E0 += 10;
    if (D_801EB2E0 >= 200) {
        D_801EB2E0 = 0;
    }
    for (i = 0; i < D_801F367C; i++) {
        u = D_801F0CB0[i];
        if ((*(s32 *)((u8 *)(u) + (0))) & 0x10) {
            if (!((*(s32 *)((u8 *)(u) + (0))) & 0x1000)) {
                r = func_00133944(u);
                if (r == -1) {
                    r = func_00133700(u);
                    if (r == -1) {
                        continue;
                    }
                }
                func_00133490(u, r);
            }
        }
    }
}
s32 func_00133700(u8 *u);
