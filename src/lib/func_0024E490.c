typedef unsigned char u8;
typedef signed short s16;
typedef signed int s32;
typedef unsigned int u32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

extern void func_001F7344(u32 value, void *workspace, u32 flags);
extern void func_001F85C0(void *workspace, const u8 *record);

void func_0024E490(u32 value, const u8 *records, u32 count)
{
    u8 workspace[0x10];
    u32 masked_value;
    void *workspace_ptr;
    register const u8 *record asm("$17") = records;
    register s32 count_reg asm("$16");
    register s16 index asm("$18");
    register u32 flags_reg asm("$2");
    register s16 next asm("$2");

    masked_value = value & 0xFF;
    workspace_ptr = workspace;
    asm("" : : "r"(masked_value), "r"(workspace_ptr));
    asm("" : : : "$31");
    asm volatile("lbu $2,2($17)\n"
                 "addu $18,$0,$0\n"
                 "addu $16,$6,$0"
                 : "=r"(flags_reg), "=r"(index), "=r"(count_reg)
                 : "r"(record), "r"(count)
                 : "memory");
    func_001F7344(masked_value, workspace_ptr, flags_reg & 0xF0);
    count_reg &= 0xFF;
    if (count_reg == 0) {
        return;
    }
    do {
        const u8 *current = record;
        record += 6;
        func_001F85C0(workspace, current);
        next = index + 1;
        index = next;
    } while (next < count_reg);
}
