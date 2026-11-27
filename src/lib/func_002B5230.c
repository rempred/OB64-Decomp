typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    u8 unk0[0xF];
    u8 flag;
} Rec2B5;
inline s32 func_002B5230(u8 *o, s32 k) {
    Rec2B5 *e = ((Rec2B5 **)o)[k];
    u8 n = o[0x86];
    Rec2B5 *end;
    if (n != 0) {
        end = e + (s32)((*(u32 *)((u8 *)(o) + (0xC))) >> 4) / 30 * n;
    loop:
        if (e < end) {
            (e++)->flag = 0;
            (e++)->flag = 0;
            goto loop;
        }
    }
    return 0;
}
