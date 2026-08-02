typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef struct Func0026B820Data {
    void *base_00;
    s32 count_04;
    u16 *flags_08;
    u8 *records_0C;
} Func0026B820Data;

typedef struct Func0026B820State {
    u8 unused_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *argument_0C;
    void *argument_10;
    u8 unused_14[8];
    Func0026B820Data data;
} Func0026B820State;

extern void *g_func_0026B820_dispatch_table[];
extern volatile u32 g_func_0026B820_value_38;
extern volatile u32 g_func_0026B820_count;

extern void func_00268798(void *record);
extern void func_00268800(void *record);
extern void *func_00001330(u32 size);
extern void func_000016C4(void *pointer);
extern void func_00268678(void *record, void *value);
extern void func_00268358(u32 value, void *record_value);
extern void func_00267FD0(void *argument, u32 *record, void *record_value);
extern void func_00028F60(void *scratch, u32 value_0C, u32 value_10, u32 value_14);
extern void func_002136F4(void *scratch, void *value_04, void *value_08);
extern void func_0026A510(float base_00, float base_04, u32 base_08, u32 entry_04);
extern void func_0026A630(float base_00, float base_04, u32 base_08, u32 entry_04);
extern void func_00268F64(void *argument, void *value_04, void *value_0C);

u32 func_0026B820(u32 selector_arg, Func0026B820State *state_arg)
{
    Func0026B820State *state = state_arg;
    register Func0026B820Data *data asm("$17") = &state->data;
    register float one_float asm("$f22");
    register float zero_float asm("$f20");
    u32 result = 0;
    volatile u8 frame_pad[0x8C];
    u32 selector;

    selector = selector_arg & 0xFFFF;

    if (selector < 7) {
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_1));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_2));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_6));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_0));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_5));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_3));
        __asm__ volatile ("" : : "X"(&&func_0026B820_case_4));
        goto *g_func_0026B820_dispatch_table[selector];
    }
    data = &state->data;
    goto func_0026B820_return;

func_0026B820_case_1:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$18");
        if (data->count_04 <= 0) goto func_0026B820_return;
        offset = 0;
            do {
            func_00268798(data->records_0C + offset);
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B820_return;

func_0026B820_case_2:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$18");
        if (data->count_04 <= 0) goto func_0026B820_case_2_free;
        offset = 0;
        do {
            func_00268800(data->records_0C + offset);
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
func_0026B820_case_2_free:
    func_000016C4(data->base_00);
    func_000016C4(data->flags_08);
    func_000016C4(data->records_0C);
    goto func_0026B820_return;

func_0026B820_case_6:
    result = **(u32 **)(data->records_0C + 4);
    goto func_0026B820_return;

func_0026B820_case_0:
    {
        data->count_04 = g_func_0026B820_count;
        data->base_00 = func_00001330((data->count_04 * 3) << 3);
        data->flags_08 = (u16 *)func_00001330(data->count_04 << 1);
        data->records_0C = (u8 *)func_00001330((data->count_04 * 3) << 3);
    }
    {
        register s32 offset asm("$16");
        register s32 index asm("$18");
        register s32 one asm("$19");
        index = 0;
        if (data->count_04 <= 0) goto func_0026B820_return;
        one = 1;
        one_float = 1.0f;
        offset = 0;
        zero_float = 0.0f;
        do {
            func_00268678(data->records_0C + offset,
                          (void *)g_func_0026B820_value_38);
            data->flags_08[index] = one;
            {
                register void *base asm("$2") = data->base_00;
                base = (u8 *)base + offset;
                *(float *)((u8 *)base + 0x08) = zero_float;
                *(float *)((u8 *)base + 0x04) = zero_float;
                *(float *)((u8 *)base + 0x00) = zero_float;
                *(float *)((u8 *)base + 0x14) = one_float;
                *(float *)((u8 *)base + 0x10) = one_float;
                *(float *)((u8 *)base + 0x0C) = one_float;
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B820_return;

func_0026B820_case_5:
    {
        register s32 index asm("$16") = 0;
        register s32 offset asm("$19");
        if (data->count_04 <= 0) goto func_0026B820_case_5_clear;
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
func_0026B820_case_5_clear:
    state->flags_08 &= (u16)~4;
    goto func_0026B820_return;

func_0026B820_case_3:
    {
        register s32 index asm("$16");
        register s32 offset asm("$18");
        index = 0;
        if (*((volatile s32 *)&data->count_04) <= 0) goto func_0026B820_case_3_loop_2;
        offset = 0;
        do {
                if ((data->flags_08[index] & 1) != 0) {
                    u32 *record = (u32 *)(offset + (u32)data->records_0C);
                    func_00267FD0(state->argument_10,
                                  (u32 *)record[1],
                                  (void *)record[2]);
                }
                index += 1;
                offset += 0x18;
        } while (index < data->count_04);

func_0026B820_case_3_loop_2:
        index = 0;
        if (data->count_04 <= 0) goto func_0026B820_case_3_loop_3;
        offset = 0;
        do {
                if ((data->flags_08[index] & 1) != 0) {
                    {
                        register void *scratch_arg asm("$4") = (void *)&frame_pad[0x08];
                        register u32 *record asm("$2");
                        func_00028F60(scratch_arg,
                                      *(u32 *)(offset + (u32)data->base_00 + 0x0C),
                                      *(u32 *)(offset + (u32)data->base_00 + 0x10),
                                      *(u32 *)(offset + (u32)data->base_00 + 0x14));
                        record = (u32 *)(offset + (u32)data->records_0C);
                        asm volatile (
                            ".set noreorder\n"
                            "lw $5,4(%0)\n"
                            "lw $6,8(%0)\n"
                            "jal func_002136F4\n"
                            "addiu $4,$sp,0x18\n"
                            ".set reorder\n"
                            :
                            : "r"(record)
                            : "$4", "$5", "$6", "memory");
                    }
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

func_0026B820_case_3_loop_3:
        index = 0;
        if (*((volatile s32 *)&data->count_04) <= 0) goto func_0026B820_case_3_loop_4;
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                register u32 *base asm("$3") = (u32 *)data->base_00;
                register u32 call_value_0 asm("$4") = record[2];
                register u32 *call_value_1 asm("$5") = (u32 *)record[1];
                asm volatile ("sw %0,0x10($sp)" : : "r"(call_value_0) : "memory");
                record = (u32 *)(offset + (u32)data->records_0C);
                asm volatile (
                    "addu %0,%1,%2\n"
                    "sw %3,0x14($sp)"
                    : "=r"(base)
                    : "r"(offset), "0"(base), "r"(record[3])
                    : "memory");
                func_0026A510(
                    *(float *)((u8 *)base + 0x00),
                    *(float *)((u8 *)base + 0x04),
                    *(u32 *)((u8 *)base + 0x08),
                    call_value_1[1]);
                asm volatile ("" : : "r"(call_value_1) : "memory");
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);

func_0026B820_case_3_loop_4:
        index = 0;
        if (data->count_04 <= 0) goto func_0026B820_return;
        offset = 0;
        do {
            if ((data->flags_08[index] & 1) != 0) {
                u32 *record = (u32 *)(offset + (u32)data->records_0C);
                register u32 *base asm("$3") = (u32 *)data->base_00;
                register u32 call_value_0 asm("$4") = record[2];
                register u32 *call_value_1 asm("$5") = (u32 *)record[1];
                asm volatile ("sw %0,0x10($sp)" : : "r"(call_value_0) : "memory");
                record = (u32 *)(offset + (u32)data->records_0C);
                asm volatile (
                    "addu %0,%1,%2\n"
                    "sw %3,0x14($sp)"
                    : "=r"(base)
                    : "r"(offset), "0"(base), "r"(record[3])
                    : "memory");
                func_0026A630(
                    *(float *)((u8 *)base + 0x00),
                    *(float *)((u8 *)base + 0x04),
                    *(u32 *)((u8 *)base + 0x08),
                    call_value_1[1]);
                asm volatile ("" : : "r"(call_value_1) : "memory");
            }
            index += 1;
            offset += 0x18;
        } while (index < data->count_04);
    }
    goto func_0026B820_return;

func_0026B820_case_4:
    {
        register s32 index asm("$16") = 0;
        s32 offset;
        if (data->count_04 > 0) {
            offset = 0;
            do {
                if ((data->flags_08[index] & 1) != 0) {
                    u32 *record = (u32 *)(offset + (u32)data->records_0C);
                    if (*(u16 *)((u8 *)record + 0x10) != 0) {
                        func_00268F64(state->argument_10,
                                      (void *)record[1],
                                      (void *)record[3]);
                    }
                }
                index += 1;
                offset += 0x18;
            } while (index < data->count_04);
        }
    }
    asm ("" : "=m"(frame_pad));
    goto func_0026B820_return;

func_0026B820_return:
    return result;
}
