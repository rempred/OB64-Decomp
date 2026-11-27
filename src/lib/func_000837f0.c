typedef unsigned char u8;
typedef signed int s32;
typedef unsigned int u32;
void * func_00001330(unsigned int);
typedef struct {
    u8 pad[0x14];
    void *buf[8];
} Bufs836;
extern Bufs836 *D_801A7960;
void *D_8009DD38(u32 handle);
void func_000851d0(void);
void func_000837f0(void) {
    D_801A7960 = func_00001330(sizeof(Bufs836));
    D_801A7960->buf[0] = D_8009DD38(0x1DBB2AC);
    D_801A7960->buf[1] = D_8009DD38(0x1DB47A0);
    D_801A7960->buf[2] = D_8009DD38(0x1DC3320);
    D_801A7960->buf[3] = func_00001330(0xC00);
    D_801A7960->buf[4] = func_00001330(0xC00);
    func_000851d0();
    D_801A7960->buf[5] = D_8009DD38(0x1DF9F8C);
    D_801A7960->buf[6] = D_8009DD38(0x1DB3672);
    D_801A7960->buf[7] = D_8009DD38(0x1DC3064);
}
