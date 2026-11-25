typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
extern u8 *D_80196AF8;
void func_000bacec(void);
typedef struct {
    u8 b[0xE];
} GroupD21;
typedef struct {
    u8 b[0x36];
} SquadD21;
typedef struct {
    u8 pad[0x10D4];
    GroupD21 grp[10];
    u8 pad1160[0x117C - 0x1160];
    SquadD21 sq[1];
} SaveD21;
void func_000daa84(u8 g, u8 slot);
u8 func_000bbb34(u16 sq);
void func_000da7d4(u16 g, u16 sq, u16 slot) {
    u8 *gr = ((SaveD21 *)D_80196AF8)->grp[g].b;
    u8 *e = gr + slot;
    if (e[2] != 0xFF) {
        ((SaveD21 *)D_80196AF8)->sq[e[2]].b[2] = 0xFF;
        func_000daa84(g, slot);
        if (((SaveD21 *)D_80196AF8)->sq[e[2]].b[1] & 8) {
            (*(s32 *)((u8 *)(D_80196AF8) + (0x2C0)))++;
        }
        ((SaveD21 *)D_80196AF8)->sq[e[2]].b[1] = 0;
        gr[8]--;
        func_000bacec();
    }
    if (slot == 0) {
        gr[9] = func_000bbb34(sq) + 1;
    }
    ((SaveD21 *)D_80196AF8)->sq[sq].b[2] = g;
    gr[8]++;
    (gr + slot)[2] = sq;
    ((SaveD21 *)D_80196AF8)->sq[sq].b[1] |= 0x82;
}
void func_000daa84(u8 sq, u8 k);
