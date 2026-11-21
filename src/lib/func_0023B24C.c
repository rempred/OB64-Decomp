typedef unsigned char u8;
typedef signed short s16;
typedef struct {
    u8 unk00[0xD0];
    u8 bD0;
} Ent23B;
void *D_801C8FE8(unsigned int index);
void func_0023B24C(s16 a) {
    Ent23B *record = D_801C8FE8(a);

    record->bD0 = 1;
}
