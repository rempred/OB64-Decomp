typedef signed short s16;
typedef signed int s32;
typedef struct {
    s32 unk00;
    s32 key2;
    s32 unk08;
    s32 key1;
    s16 kind;
    s16 idx;
} Sort29C;
s32 func_002A17E0(Sort29C *a, Sort29C *b);
s32 func_002A17E0(Sort29C *a, Sort29C *b) {
    if (a->key1 < b->key1) {
        return -1;
    }
    if (a->key1 > b->key1) {
        return 1;
    }
    if (a->key2 < b->key2) {
        return 1;
    }
    if (a->key2 > b->key2) {
        return -1;
    }
    return a - b;
}
