typedef unsigned char u8;
typedef signed short s16;
typedef struct {
    u8 b[16];
    s16 h;
} Opts42;
extern Opts42 D_800ABD80;
extern Opts42 D_800E9C08;
void func_00042800(void);
void func_00042e64(void *buffer);
/* Copy the save options before encoding the 0x38-byte character table. */
void func_00042d40(void *save_buffer) {
    func_00042800();
    D_800E9C08 = D_800ABD80;
    func_00042e64(save_buffer);
}
void func_00042e64(void *save_buffer);
