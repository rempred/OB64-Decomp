typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
extern s32 D_801F3658;
extern u32 *D_801F0CB0[];
extern s32 D_801F0DE0;
extern u8 D_801F0FDF;
extern u8 D_801F0FE0;
extern u8 D_801F0FE1;
extern u8 D_801969BA[];
extern u16 D_801951CC[];
extern u8 g_func_001957D0_source_records[];
extern u8 D_801971F1[];
u8 func_00191E50(void);
s32 D_801DADF0(u32 *u);
s32 D_801DA228(u32 *u);
s32 D_801DD244(void);
void D_801DCC48(u8 *sq);
void func_00194FA8(void) {
    u32 *u;
    s32 n;
    s32 bit;
    s32 loc;
    s32 i;
    u8 *sq;
    if (func_00191E50() != 0) {
        return;
    }
    u = D_801F0CB0[D_801F3658];
    D_801F0DE0 = 4;
    D_801F0FE1 = D_801DADF0(u);
    D_801F0FDF = 5;
    n = 3;
    if (!(*u & 0x40)) {
        loc = u[0x74 / 4];
    } else {
        loc = D_801F0CB0[D_801969BA[D_801DA228(u) * 11]][0x74 / 4];
    }
    bit = 0x200;
    {
        u16 f = D_801951CC[loc * 18];
        if (f & 0x100) {
            n++;
        } else {
            n += (f & 0x200) == bit;
        }
    }
    if (D_801DD244() != 0) {
        n = 2;
    }
    D_801F0FE0 = n;
    {
        s32 o;
        for (i = 0, sq = g_func_001957D0_source_records, o = 0; i < 30; i++, o += 25) {
            if (D_801971F1[o] & 1) {
                D_801DCC48(sq);
            }
            sq += 25;
        }
    }
}
