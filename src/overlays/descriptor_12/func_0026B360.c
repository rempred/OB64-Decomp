typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef struct Func0026B360Data {
    void *base_00;
    s32 count_04;
    u16 *flags_08;
    u8 *records_0C;
} Func0026B360Data;

typedef struct Func0026B360State {
    u8 unused_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *argument_0C;
    void *argument_10;
    u8 unused_14[8];
    Func0026B360Data data;
} Func0026B360State;

extern void *g_func_0026B360_dispatch_table[];
extern volatile u32 g_func_0026B360_value_38;
extern volatile u32 g_func_0026B360_count;

extern void func_00268798(void *record);
extern void func_00268800(void *record);
extern void func_00268678(void *record, void *value);
extern void func_00028C40(void *base);
extern void func_00268358(u32 value, void *record_value);
extern void func_00267FD0(void *argument, u32 *record, void *record_value);
extern void func_002682A4(void *base, u32 *record, void *record_value);
extern void func_00268400(u32 value, void *record_value, void *record_data);
extern void func_002677D0(u32 value, void *record_value, void *argument);
extern void func_0026A078(void *argument, u32 *record, void *record_data);
extern void func_00268F64(void *argument, u32 *record, void *record_data);
extern void *func_00001330(u32 size);
extern void func_000016C4(void *pointer);

u32 func_0026B360(u32 selector_arg, Func0026B360State *state_arg)
{
    Func0026B360State *state = state_arg;
    register Func0026B360Data *data asm("$17") = &state->data;
    u32 result = 0;
    u8 frame_pad[0x4C];
    u32 selector;

    selector = selector_arg & 0xFFFF;

    if (selector < 7) {
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_1));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_2));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_6));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_0));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_5));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_3));
        __asm__ volatile ("" : : "X"(&&func_0026B360_case_4));
        goto *g_func_0026B360_dispatch_table[selector];
    }
    goto func_0026B360_return;

func_0026B360_case_1:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$18");
        if (data->count_04 <= 0) goto func_0026B360_return;
        offset = 0;
        do {
            func_00268798(data->records_0C + offset);
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B360_return;

func_0026B360_case_2:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$18");
        if (data->count_04 <= 0) goto func_0026B360_case_2_free;
        offset = 0;
        do {
            func_00268800(data->records_0C + offset);
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
func_0026B360_case_2_free:
    func_000016C4(data->base_00);
    func_000016C4(data->flags_08);
    func_000016C4(data->records_0C);
    goto func_0026B360_return;

func_0026B360_case_6:
    result = **(u32 **)(data->records_0C + 4);
    goto func_0026B360_return;

func_0026B360_case_0:
    {
        data->count_04 = g_func_0026B360_count;
        data->base_00 = func_00001330(data->count_04 << 6);
        data->flags_08 = (u16 *)func_00001330(data->count_04 << 1);
        data->records_0C = (u8 *)func_00001330((data->count_04 * 3) << 3);
    }
    {
        register s32 index asm("$16") = 0;
        u32 one;
        register s32 offset asm("$18");
        if (data->count_04 <= 0) goto func_0026B360_return;
        one = 1;
        offset = 0;
        do {
            func_00268678(data->records_0C + offset, (void *)g_func_0026B360_value_38);
            data->flags_08[index] = one;
            {
                register void *base asm("$2") = data->base_00;
                register u32 base_offset asm("$4") = index << 6;
                func_00028C40((u8 *)base + base_offset);
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B360_return;

func_0026B360_case_5:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$19");
        if (data->count_04 <= 0) goto func_0026B360_case_5_clear;
        offset = 0;
        do {
            u16 flags = data->flags_08[index];
            if ((flags & 1) != 0 && (flags & 0x8000) == 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                u32 *entry = (u32 *)record[1];
                func_00268358(entry[1], (void *)record[3]);
                data->flags_08[index] |= 0x8000;
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
func_0026B360_case_5_clear:
    state->flags_08 &= (u16)~4;
    goto func_0026B360_return;

func_0026B360_case_3:
    {
        register s32 index asm("$16");
        register s32 offset asm("$18");

        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "lw $2,0x4($17)\n"
            "blez $2,%0\n"
            "addu $16,$0,$0\n"
            ".set macro\n"
            ".set reorder"
            :
            : "X"(&&func_0026B360_case_3_check_2)
            : "$2", "$16", "memory");
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                func_00267FD0(state->argument_10, (u32 *)record[1], (void *)record[2]);
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "lw $2,0x4($17)\n"
            ".set macro\n"
            ".set reorder"
            :
            :
            : "$2", "memory");
func_0026B360_case_3_check_2:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "blez $2,%0\n"
            "addu $16,$0,$0\n"
            ".set macro\n"
            ".set reorder"
            :
            : "X"(&&func_0026B360_case_3_check_3_entry)
            : "$2", "$16", "memory");
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                {
                    register void *base asm("$3") = data->base_00;
                    register u32 base_offset asm("$4") = index << 6;
                    func_002682A4((u8 *)base + base_offset, (u32 *)record[1], (void *)record[2]);
                }
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

func_0026B360_case_3_check_3_entry:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "lw $2,0x4($17)\n"
            ".set macro\n"
            ".set reorder"
            :
            :
            : "$2", "memory");
func_0026B360_case_3_check_3:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "blez $2,%0\n"
            "addu $16,$0,$0\n"
            ".set macro\n"
            ".set reorder"
            :
            : "X"(&&func_0026B360_case_3_check_4)
            : "$2", "$16", "memory");
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                u32 *entry = (u32 *)record[1];
                func_00268400(entry[1], (void *)record[2], (void *)record[3]);
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "lw $2,0x4($17)\n"
            ".set macro\n"
            ".set reorder"
            :
            :
            : "$2", "memory");
func_0026B360_case_3_check_4:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "blez $2,%0\n"
            "addu $16,$0,$0\n"
            ".set macro\n"
            ".set reorder"
            :
            : "X"(&&func_0026B360_case_3_check_5_entry)
            : "$2", "$16", "memory");
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0 && (state->flags_0A & 0x1000) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                u32 *entry = (u32 *)record[1];
                func_002677D0(entry[1], (void *)record[3], state->argument_0C);
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

func_0026B360_case_3_check_5_entry:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "lw $2,0x4($17)\n"
            ".set macro\n"
            ".set reorder"
            :
            :
            : "$2", "memory");
func_0026B360_case_3_check_5:
        __asm__ volatile (
            ".set noreorder\n"
            ".set nomacro\n"
            "blez $2,%0\n"
            "addu $16,$0,$0\n"
            ".set macro\n"
            ".set reorder"
            :
            : "X"(&&func_0026B360_return)
            : "$2", "$16", "memory");
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                func_0026A078(state->argument_10, (u32 *)record[1], (void *)record[2]);
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B360_return;

func_0026B360_case_4:
    {
        register s32 index asm("$16") = 0;
        s32 offset;
        if (data->count_04 > 0) {
            offset = 0;
            do {
                if ((data->flags_08[index] & 1) != 0) {
                    u32 *record = (u32 *)(offset + (u32)data->records_0C);
                    if (*(u16 *)((u8 *)record + 0x10) != 0) {
                        func_00268F64(state->argument_10, (u32 *)record[1], (void *)record[3]);
                    }
                }
                index += 1;
                offset += 0x18;
            } while (index < data->count_04);
        }
    }
    asm ("" : "=m"(frame_pad));
    goto func_0026B360_return;

func_0026B360_return:
    return result;
}
