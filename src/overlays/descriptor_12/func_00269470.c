typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;

asm(".macro move dst,src\n"
    "addu \\dst,\\src,$0\n"
    ".endm\n");

typedef void (*Func00269470Callback)(u32 reason, void *state_fields, void *argument);

typedef union Func00269470Value40 {
    float as_float;
    u32 as_u32;
} Func00269470Value40;

typedef struct Func00269470Fields {
    u8 unused_00[0x40];
    Func00269470Value40 value_40;
    u8 unused_44[6];
    u16 flags_4A;
    u8 work_4C[4];
    u32 *record_50;
    void *value_54;
    void *value_58;
    u16 value_5C;
    u8 unused_5E[6];
    u16 value_64;
    u16 value_66;
    void *value_68;
    void *value_6C;
    Func00269470Callback callback_70;
} Func00269470Fields;

typedef struct Func00269470State {
    u8 unused_00[8];
    u16 flags_08;
    u16 flags_0A;
    void *value_0C;
    void *value_10;
    u8 unused_14[8];
    Func00269470Fields fields;
} Func00269470State;

extern volatile u16 g_func_00269470_flags;
extern volatile Func00269470Callback g_func_00269470_callback;
extern volatile u16 g_func_00269470_value_44;
extern volatile u16 g_func_00269470_value_46;
extern void * volatile g_func_00269470_value_48;
extern void * volatile g_func_00269470_value_4C;
extern void * volatile g_func_00269470_value_3C;
extern void *g_func_00269470_dispatch_table[];

extern void func_00268798(void *target);
extern void func_00268AD8(void *target, u16 value_64, void *value_68, u16 value_66, void *value_6C);
extern void func_00268800(void *target);
extern void func_00268890(
    void *target,
    void *value_3C,
    u16 value_64,
    void *value_68,
    u16 value_66,
    void *value_6C);
extern void func_00268678(void *target, void *value_3C);
extern void func_00028C40(Func00269470Fields *fields);
extern void func_00268358(u32 count, void *value_58);
extern void func_00267FD0(void *value_10, u32 *record, void *value_54);
extern void func_002682A4(Func00269470Fields *fields, u32 *record, void *value_54);
extern void func_00268400(u32 count, void *value_54, void *value_58);
extern void func_002677D0(u32 count, void *value_58, void *value_0C);
extern void func_00268478(u32 record_first, void *value_54, u32 value_40);
extern void func_0026909C(void *value_10, u32 *record, void *value_58, u16 value_66, void *value_6C);
extern void func_00268F64(void *value_10, u32 *record, void *value_58);

u32 func_00269470(u32 selector_arg, Func00269470State *state_arg)
{
    Func00269470State *state = state_arg;
    Func00269470Fields *fields = &state->fields;
    u32 result = 0;
    u32 frame_pad;
    u32 selector;

    asm ("" : "=m"(frame_pad));
    selector = selector_arg & 0xFFFF;

    if (selector < 7) {
        __asm__ volatile ("" : : "X"(&&func_00269470_case_1));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_2));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_6));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_0));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_5));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_3));
        __asm__ volatile ("" : : "X"(&&func_00269470_case_4));
        goto *g_func_00269470_dispatch_table[selector];
    }
    goto func_00269470_return;

func_00269470_case_1:
        if ((fields->flags_4A & 1) != 0 && fields->callback_70 != 0) {
            fields->callback_70(1, fields, 0);
        }
        func_00268798(fields->work_4C);
        goto func_00269470_return;

func_00269470_case_2:
        if ((fields->flags_4A & 4) != 0) {
            func_00268AD8(
                fields->work_4C,
                fields->value_64,
                fields->value_68,
                fields->value_66,
                fields->value_6C);
        } else {
            func_00268800(fields->work_4C);
        }
        goto func_00269470_return;

func_00269470_case_6:
        result = fields->record_50[0];
        goto func_00269470_return;

func_00269470_case_0:
        fields->flags_4A = g_func_00269470_flags;
        asm volatile ("" : : : "memory");
        fields->callback_70 = g_func_00269470_callback;
        asm volatile ("" : : : "memory");
        fields->value_64 = g_func_00269470_value_44;
        asm volatile ("" : : : "memory");
        fields->value_66 = g_func_00269470_value_46;
        asm volatile ("" : : : "memory");
        fields->value_68 = g_func_00269470_value_48;
        asm volatile ("" : : : "memory");
        {
            register void *branch_value_6C asm("$3");
            register u16 call_value_66 asm("$2");
            register void *call_value_3C asm("$5");
            register u16 call_value_64 asm("$6");
            asm volatile ("lhu $2,0x4A($16)" : : : "memory");
            branch_value_6C = g_func_00269470_value_4C;
            asm volatile (
                ".set noreorder\n"
                ".set nomacro\n"
                "andi $2,$2,0x0004\n"
                "beq $2,$0,%0\n"
                "sw $3,0x6C($16)\n"
                ".set macro\n"
                ".set reorder"
                :
                : "X"(&&func_00269470_after_68890)
                : "memory");
            call_value_66 = fields->value_66;
            asm volatile ("" : : : "memory");
            call_value_3C = g_func_00269470_value_3C;
            asm volatile ("" : : : "memory");
            call_value_64 = fields->value_64;
            asm volatile ("" : : : "memory");
            func_00268890(
                fields->work_4C,
                call_value_3C,
                call_value_64,
                fields->value_68,
                call_value_66,
                fields->value_6C);
            asm volatile (
                ".set noreorder\n"
                ".set nomacro\n"
                "j .Lfunc_00269470_asm_after_68890\n"
                "nop\n"
                ".set macro\n"
                ".set reorder"
                :
                :);
        }
func_00269470_after_68890:
        asm (
            ".set noreorder\n"
            ".Lfunc_00269470_before_68678:\n"
            ".set reorder");
        func_00268678(fields->work_4C, g_func_00269470_value_3C);
        asm (
            ".set noreorder\n"
            ".Lfunc_00269470_asm_after_68890:\n"
            ".set reorder");
        {
            u32 mask = 0;
            u32 index = 0;
            u32 count = fields->record_50[1];
            u32 **entry = (u32 **)fields->value_58;
            asm volatile ("" : "=r"(mask), "=r"(index), "=r"(count), "=r"(entry));
            asm volatile (
                ".set noreorder\n"
                ".set nomacro\n"
                "lhu $2,0x4A($16)\n"
                "andi $3,$2,0x0010\n"
                "sltu $3,$0,$3\n"
                "andi $2,$2,0x0020\n"
                "beq $2,$0,1f\n"
                "addu $6,$3,$0\n"
                "ori $6,$3,0x0002\n"
                "1:\n"
                "lw $5,0x50($16)\n"
                "lw $2,0x4($5)\n"
                "lw $4,0x58($16)\n"
                "beq $2,$0,2f\n"
                "addu $3,$0,$0\n"
                "3:\n"
                "lw $2,0($4)\n"
                "bnel $2,$0,4f\n"
                "sh $6,0x18($2)\n"
                "4:\n"
                "lw $2,0x4($5)\n"
                "addu $3,$3,1\n"
                "sltu $2,$3,$2\n"
                "bne $2,$0,3b\n"
                "addu $4,$4,4\n"
                "2:\n"
                ".set macro\n"
                ".set reorder"
                :
                :
                : "$2", "$3", "$4", "$5", "$6", "memory");
        }
        func_00028C40(fields);
        fields->value_40.as_float = 1.0f;
        if ((fields->flags_4A & 1) != 0 && fields->callback_70 != 0) {
            fields->callback_70(0, fields, 0);
        }
        goto func_00269470_return;

func_00269470_case_5:
        func_00268358(fields->record_50[1], fields->value_58);
        state->flags_08 &= (u16)~4;
        goto func_00269470_return;

func_00269470_case_3:
        func_00267FD0(state->value_10, fields->record_50, fields->value_54);
        func_002682A4(fields, fields->record_50, fields->value_54);
        func_00268400(fields->record_50[1], fields->value_54, fields->value_58);
        if ((state->flags_0A & 0x1000) != 0) {
            func_002677D0(fields->record_50[1], fields->value_58, state->value_0C);
        }
        goto func_00269470_return;

func_00269470_case_4:
        if ((fields->flags_4A & 2) != 0) {
            func_00268478(fields->record_50[1], fields->value_54, fields->value_40.as_u32);
        }
        if (fields->value_5C != 0) {
            if ((fields->flags_4A & 4) != 0) {
                func_0026909C(
                    state->value_10,
                    fields->record_50,
                    fields->value_58,
                    fields->value_66,
                    fields->value_6C);
            } else {
                func_00268F64(state->value_10, fields->record_50, fields->value_58);
            }
        }
        if ((fields->flags_4A & 1) != 0 && fields->callback_70 != 0) {
            fields->callback_70(2, fields, state->value_10);
        }
        goto func_00269470_return;

func_00269470_return:
    return result;
}
