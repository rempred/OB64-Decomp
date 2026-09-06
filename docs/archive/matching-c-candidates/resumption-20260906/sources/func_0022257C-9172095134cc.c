typedef unsigned char u8;
typedef unsigned int u32;
typedef signed int s32;

typedef struct {
    u32 words[20];
} LocalCopy;

void func_001F0E64(LocalCopy *copy, s32 arg1);
s32 func_001F197C(void *arg0, LocalCopy *copy, s32 *arg2);

s32 func_0022257C(void *arg0, s32 arg1, s32 *arg2)
{
    LocalCopy copy;

    copy = *(LocalCopy *)arg0;
    func_001F0E64(&copy, arg1);
    return func_001F197C(*(void **)(*(u8 **)((u8 *)arg0 + 0x4C) + 0x40), &copy, arg2);
}
