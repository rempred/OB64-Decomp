typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
typedef struct {
    s32 key;
    s32 val;
} Pair145;
extern Pair145 D_801FCF40[];
extern u8 D_801FCE94[];
extern s32 D_801FCD50[];
s32 func_00145210(s32 a, s32 alt) {
    s32 r = -1;
    u32 i;
    if (alt) {
        for (i = 0; i < 5; i++) {
            if (D_801FCF40[i].key == a) {
                r = D_801FCF40[i].val;
                break;
            }
        }
    } else {
        r = D_801FCD50[D_801FCE94[a]];
    }
    return r;
}
