typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef struct {
    u8 unk00[2];
    u16 hi;
    u8 mid;
    u8 lo;
} TimeStamp;
typedef struct {
    u16 unk0;
    u16 active;
    u16 unk4;
    s16 sel;
} Sel28;
extern Sel28 D_8023DF10;
extern u8 D_80197810[];
void memcpy_aligned(void *dst, void *src, s32 n);
void memcpy_aligned(void *dst, void *src, s32 n);
extern inline s16 func_0028a9dc(TimeStamp *a, TimeStamp *b) {
    s32 va = a->lo + a->mid * 30 + a->hi * 600;
    s32 vb = b->lo + b->mid * 30 + b->hi * 600;
    if (vb >= va) {
        return 0;
    }
    return 1;
}
extern u8 D_80193678[];
extern s16 D_8023DF16;
void func_0028aa4c(void) {
    s16 i;
    memcpy_aligned((u8 *)&D_8023DF10 + 2, D_80193678, 4);
    if (*(u8 *)&D_8023DF10 != 0 && D_8023DF10.active != 0) {
        for (i = 0; i < 0x79; i++) {
            if (func_0028a9dc((TimeStamp *)&D_80197810[i * 6], (TimeStamp *)&D_8023DF10) == 1) {
                D_8023DF16 = i;
                return;
            }
        }
    }
}
void func_0028aa4c(void);
