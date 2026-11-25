typedef unsigned char u8;
typedef signed int s32;
extern u8 *D_8019780C;
typedef struct {
    u8 v[29];
} Cycle712;
extern Cycle712 D_801A2468;
void D_801818A0(s32, s32 b);
void func_0007819c(u8 *s, s32 b, u8 cycle);
void func_0007819c(u8 *s, s32 b, u8 cycle) {
    Cycle712 t = D_801A2468;
    s32 k = 0;
    if (cycle) {
        k = t.v[D_8019780C[4]];
        D_8019780C[4]++;
        if (k == 99) {
            D_8019780C[4] = 0;
            k = 0;
        }
    }
    D_801818A0(s + k, b);
}
