typedef unsigned int u32;
typedef unsigned char u8;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef struct Func0024DA10Scratch {
    u8 bytes[16];
} Func0024DA10Scratch;

extern void func_001F7344(u32 value, Func0024DA10Scratch *scratch, u32 flags);
extern void func_001F85C0(Func0024DA10Scratch *scratch, void *argument);

void func_0024DA10(u32 value, void *argument)
{
    Func0024DA10Scratch scratch;

    func_001F7344(value & 0xFF, &scratch, ((u8 *)argument)[2] & 0xF0);
    func_001F85C0(&scratch, argument);
}
