typedef unsigned char u8;
typedef signed int s32;
typedef struct {
    u8 unk0[0xF];
    u8 flag;
} Rec2B6;
void func_002B8290(u8 *o, s32 k) {
    Rec2B6 *src = (*(Rec2B6 * *)((u8 *)(o) + (8)));
    s32 n = (*(s32 *)((u8 *)(o) + (0x68)));
    Rec2B6 *e = ((Rec2B6 **)o)[k];
    Rec2B6 *end = e + n;
    if (o[0x84] != 0) {
    loop:
        if (e < end) {
            u8 v = src->flag;
            src += 2;
            (e++)->flag = v;
            (e++)->flag = v;
            goto loop;
        }
    }
}
