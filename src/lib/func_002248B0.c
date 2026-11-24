typedef unsigned char u8;
typedef unsigned short u16;
typedef signed int s32;
int battle_actor_is_side_one(void *record);
s32 battle_actor_has_flag_10(void *u);
u16 D_801C8FB8(u8 *u);
void D_801C41C8(s32 *a, s32 *b, s32 *c, s32 *d, s32 *e, s32 f);
void func_002248B0(u8 *u, s32 cls) {
    s32 a;
    s32 b;
    s32 c;
    s32 d;
    s32 e;
    a = (*(s32 *)((u8 *)(u) + (0x48)));
    c = battle_actor_is_side_one(u);
    d = battle_actor_has_flag_10(u);
    b = cls;
    e = D_801C8FB8(u);
    D_801C41C8(&a, &b, &c, &d, &e, 1);
}
