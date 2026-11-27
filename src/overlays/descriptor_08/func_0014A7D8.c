typedef unsigned char u8;
typedef signed int s32;
extern void *D_801FDA44;
typedef struct {
    u8 next;
    u8 kind;
    u8 state;
    u8 unk03;
    s32 key;
    u8 data[0x84];
} Rec149;
extern u8 D_801FDA42;
void bzero(void *p, s32 n);
Rec149 *func_0014A7D8(u8 kind, s32 key);
Rec149 *func_0014A7D8(u8 kind, s32 key) {
    Rec149 *e;
    if (D_801FDA42 == 0xFF) {
        for (;;) {
        }
    }
    e = &((Rec149 *)D_801FDA44)[D_801FDA42];
    D_801FDA42 = e->next;
    e->kind = 0;
    e->state = 0;
    bzero(e->data, 0x84);
    e->state = 2;
    e->kind = kind;
    e->key = key;
    return e;
}
