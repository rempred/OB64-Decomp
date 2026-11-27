typedef unsigned char u8;
void *func_000016C4(void *ptr);
typedef struct {
    u8 pad[0x14];
    void *buf[8];
} Bufs836;
extern Bufs836 *D_801A7960;
void func_000838d0(void) {
    func_000016C4(D_801A7960->buf[7]);
    func_000016C4(D_801A7960->buf[6]);
    func_000016C4(D_801A7960->buf[5]);
    func_000016C4(D_801A7960->buf[4]);
    func_000016C4(D_801A7960->buf[3]);
    func_000016C4(D_801A7960->buf[2]);
    func_000016C4(D_801A7960->buf[1]);
    func_000016C4(D_801A7960->buf[0]);
    func_000016C4(D_801A7960);
}
