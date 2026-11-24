typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef float f32;
typedef struct {
    s32 (*draw)(u8 *o);
    s32 sx;
    s32 sy;
    s32 sz;
    u8 unk10[8];
    void *img;
    u8 unk1C[4];
    f32 mf[4][4];
    u16 flags;
    s16 unk62;
    s16 unk64;
    s16 id;
} Ent23;
typedef struct {
    Ent23 ent[4];
    u8 *logo;
    u8 unk1A4[0x98];
    u16 unk23C;
    u8 unk23E[0x10E];
    u8 *backdrop;
    u8 unk350[0x10];
    s32 backdropSize;
    u8 unk364[8];
    u8 unk36C[4];
    s16 x0;
    s16 x1;
    s16 y0;
    s16 y1;
    u8 unk378[0x24C];
    u8 *img5C4;
    u8 *img5C8;
    u8 unk5CC[0x40];
    u8 *img60C;
    s16 unk610;
    s16 unk612;
    u8 unk614[0x3C];
    u16 flags;
    s16 h652;
    u8 unk654[2];
    s16 fade;
} Ctx23;
extern Ctx23 *D_801EFE48;
void func_0023E674(void) {
    Ctx23 *s = D_801EFE48;
    s32 i;
    s32 m;
    i = 0;
    m = ~0x10;
    for (; i < 4; i++) {
        if ((*(u16 *)((u8 *)(s) + (0x23C))) & 1) {
            /* Not || or &&: retail ORs the two equality results (sltiu, or) and
             * tests the sum, and KMC turns either logical form into an AND of !=. */
            if (((s->ent[i].id == 0) | (s->ent[i].id == 3)) == 0) {
                continue;
            }
            goto set;
        } else if ((u16)(s->ent[i].id - 1) < 2) {
        set:
            if (s->ent[i].flags & 0x10) {
                s->ent[i].flags = (s->ent[i].flags & m) | 0x20;
            }
        }
    }
    (*(u16 *)((u8 *)(s) + (0x23C)))++;
}
