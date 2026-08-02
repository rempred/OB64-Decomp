typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

extern void *func_00001330(u32 size);
extern void *func_0000F4E4(void *scratch, const u8 *template_data, void *buffer, u32 size);
extern void func_0000F450(void *scratch, const u8 *path);
extern u32 func_0000BE98(
    void *context,
    void *buffer,
    u32 size,
    u32 record_value,
    void *scratch_or_zero,
    u32 match_count_or_flag);
extern int func_00092F50(const u8 *record_suffix, const void *directory_entry, u32 limit);
extern void func_0000BF90(const u8 *message, void *scratch);
extern void func_0000BFC0(const u8 *message, void *scratch);

extern const u8 g_resource_template[];
extern const u8 g_resource_default_path[];
extern const u8 g_resource_result_equal[];
extern const u8 g_resource_type_4000[];
extern const u8 g_resource_missing_entry[];
extern const u8 g_resource_other_type[];
extern void *g_resource_directory_table[];

void func_0000BC8C(void *context_arg, u8 *record_arg)
{
    u8 scratch[0x108];
    u8 *record;
    register void *context asm("$19");
    void *buffer;
    register void *allocated asm("$2");
    u32 match_count;
    register const u8 *path asm("$5");
    register u32 status asm("$3");
    register u32 zero asm("$0");
    u8 flags;

    asm ("addu %0,%1,$0" : "=r"(record) : "r"(record_arg));
    flags = record[0];
    asm("" : : "r"(flags));
    asm ("addu %0,%1,$0" : "=r"(context) : "r"(context_arg));
    asm("" : : "r"(context));
    path = (const u8 *)(record + 0x16);
    if ((flags & 0x80) != 0) {
        buffer = (void *)((u32)func_0000F4E4(
            scratch,
            g_resource_template,
            (void *)((u32)func_00001330(*(u32 *)(record + 0x0C)) + zero),
            *(u32 *)(record + 0x0C)) + zero);
        func_0000BE98(
            (void *)((u32)context + zero),
            (void *)((u32)buffer + zero),
            *(u32 *)(record + 0x0C),
            *(u32 *)(record + 0x08),
            0,
            record[0] & 0x7F);
        *(volatile u8 *)buffer = 0;
        return;
    }

    if (*path == 0x2F) {
        path++;
        if (record[0x11C] == 0x4B || record[0x11C] == 0x58) {
            asm volatile (
                ".set noreorder\n"
                "1:\n"
                "lbu $2,0($5)\n"
                "andi $4,$2,0x00FF\n"
                "sltu $3,$0,$4\n"
                "xori $2,$4,0x002F\n"
                "sltu $2,$0,$2\n"
                "and $3,$3,$2\n"
                "bne $3,$0,1b\n"
                "addiu $5,$5,1\n"
                "beq $4,$0,2f\n"
                "nop\n"
                "lbu $2,0($5)\n"
                "bne $2,$0,3f\n"
                "nop\n"
                "2:\n"
                "lui $5,0x800B\n"
                "addiu $5,$5,-0x1D80\n"
                "3:\n"
                ".set reorder\n"
                : "=r"(path)
                : "0"(path)
                : "memory");
        }
    }
    func_0000F450(scratch, path);

    asm volatile (
        ".set noreorder\n"
        "lhu $2,292($17)\n"
        "andi $3,$2,0xF000\n"
        "li $2,0x8000\n"
        "bne $3,$2,.LBC8CTypeTail\n"
        "li $2,0x4000\n"
        ".set reorder\n"
        : "=r"(status)
        :
        : "memory");
    asm ("addu %0,$0,$0" : "=r"(match_count));
    buffer = g_resource_directory_table;
    for (;;) {
        void *directory_entry = *(void **)buffer;
        if (directory_entry == 0) {
            goto missing_entry;
        }
        if (!func_00092F50((const u8 *)(record + 1), directory_entry, 5)) {
            break;
        }
        buffer = (u8 *)buffer + 4;
        match_count++;
    }

    asm volatile (
        ".set noreorder\n"
        "lw $4,12($17)\n"
        "jal func_00001330\n"
        "nop\n"
        ".set reorder\n"
        : "=r"(allocated)
        :
        : "memory");
    buffer = (void *)((u32)func_0000F4E4(
        scratch,
        g_resource_template,
        (void *)((u32)allocated + zero),
        *(u32 *)(record + 0x0C)) + zero);
    if (buffer == 0) {
        return;
    }
    status = (u32)func_0000BE98(
        (void *)((u32)context + zero),
        (void *)((u32)buffer + zero),
        *(u32 *)(record + 0x0C),
        *(u32 *)(record + 0x08),
        scratch,
        match_count) + zero;
    asm(".set noreorder");
    asm volatile ("" : "=r"(buffer) : "0"(buffer) : "memory");
    if (buffer == 0) {
        return;
    }
    *(volatile u8 *)buffer = 0;
    if (*(u32 *)(record + 0x118) == 0) {
        goto done;
    }
    asm("nop");
    if (status == *(u16 *)(record + 0x116)) {
        goto done;
    }
    asm("nop");
    asm volatile (
        ".set noreorder\n"
        "lui $4,0x800B\n"
        "j .LBC8CReport\n"
        "addiu $4,$4,-0x1D60\n"
        ".set reorder\n");

    asm volatile (
        ".set noreorder\n"
        ".LBC8CTypeTail:\n"
        "bne $3,$2,.LBC8COther\n"
        "nop\n"
        "lui $4,0x800B\n"
        "jal func_0000BFC0\n"
        "addiu $4,$4,-0x1D54\n"
        "j .LBC8CDone\n"
        "nop\n"
        ".set reorder\n");
missing_entry:
    asm volatile (
        ".set noreorder\n"
        "lui $4,0x800B\n"
        "j .LBC8CReport\n"
        "addiu $4,$4,-0x1D7C\n"
        ".set reorder\n");
    asm volatile (
        ".set noreorder\n"
        ".LBC8COther:\n"
        "lui $4,0x800B\n"
        "addiu $4,$4,-0x1D2C\n"
        ".LBC8CReport:\n"
        "jal func_0000BF90\n"
        "addiu $5,$sp,24\n"
        ".LBC8CDone:\n"
        ".set reorder\n");
done:
    ;
}
