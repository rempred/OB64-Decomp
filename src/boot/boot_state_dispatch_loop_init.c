typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef int s32;

typedef struct BootTaskRecord {
    struct BootTaskRecord *previous;
    u16 status;
    u16 padding_06;
} BootTaskRecord;

typedef struct BootDispatchResult {
    void (*on_start)(void);
    u8 padding_04[8];
    void (*on_finish)(void);
    s32 mode;
} BootDispatchResult;

typedef BootDispatchResult *(*BootStateCallback)(void);
typedef void *(*BootStateService)(void);

extern BootStateCallback g_boot_state_callbacks[];
extern BootStateService g_boot_state_services[];
extern volatile u8 g_boot_task_depth;
extern volatile BootTaskRecord *g_boot_task_head;
extern volatile u16 g_boot_state_input;
extern volatile u16 g_boot_selected_callback;
extern volatile BootDispatchResult *g_boot_dispatch_result;
extern volatile u8 g_boot_dispatch_byte;
extern volatile u16 g_boot_status;
extern volatile u8 g_boot_service_flag;
extern volatile u8 g_boot_status_progress;
extern volatile u8 g_boot_mode_byte;
extern volatile u8 g_boot_mode_table[];
extern BootDispatchResult g_boot_default_result;

extern u8 func_000065E4(u32 value);
extern void func_00006724(u32 value);
extern void func_00001120(void *base, u32 size);
extern u32 func_00002D44(void);
extern void func_00003798(void);
extern void func_0000F14(void);
extern void func_00019A10(void);
extern void func_00019BC0(void);
extern void func_00019C50(void);
extern void func_00019A30(u32 value);
extern void func_00019D90_graph(u32 size);
extern void func_00019D90_status(void *message);
extern void func_00023780(void *destination, u32 size);
extern void func_00025A10(u32 value);

extern BootDispatchResult *boot_callback_01(void);
extern BootDispatchResult *boot_callback_02(void);
extern BootDispatchResult *boot_callback_03(void);
extern BootDispatchResult *boot_callback_04(void);
extern BootDispatchResult *boot_callback_05(void);
extern BootDispatchResult *boot_callback_06(void);
extern BootDispatchResult *boot_callback_07(void);
extern BootDispatchResult *boot_callback_08(void);
extern BootDispatchResult *boot_callback_09(void);
extern BootDispatchResult *boot_callback_10(void);
extern BootDispatchResult *boot_callback_11(void);
extern BootDispatchResult *boot_callback_12(void);
extern BootDispatchResult *boot_callback_13(void);
extern BootDispatchResult *boot_callback_14(void);
extern BootDispatchResult *boot_callback_15(void);
extern BootDispatchResult *boot_callback_16(void);
extern BootDispatchResult *boot_callback_17(void);
extern BootDispatchResult *boot_callback_18(void);
extern BootDispatchResult *boot_callback_19(void);
extern BootDispatchResult *boot_callback_20(void);
extern BootDispatchResult *boot_callback_21(void);
extern BootDispatchResult *boot_callback_22(void);
extern BootDispatchResult *boot_callback_23(void);
extern BootDispatchResult *boot_callback_24(void);

static inline BootDispatchResult *boot_state_service_model(u32 state) __attribute__((unused));
static inline BootDispatchResult *boot_state_default_model(void) __attribute__((unused));
static inline u32 boot_state_finish_model(void) __attribute__((unused));

static inline BootDispatchResult *boot_state_service_model(u32 state)
{
    u32 selector = state - 3;

    if (selector < 0x15) {
        goto *g_boot_state_services[selector];
    }
    return (BootDispatchResult *)1;

boot_state_service_model_zero:
    return 0;
}

static inline BootDispatchResult *boot_state_default_model(void)
{
    return &g_boot_default_result;
}

static inline u32 boot_state_finish_model(void)
{
    asm(".set noreorder");
    g_boot_status = 0xFFFE;
    return 0xFFFE;
}

static inline void boot_state_dispatch_model(void) __attribute__((unused));
static inline void boot_state_dispatch_model(void)
{
    register BootTaskRecord *task asm("$16") = (BootTaskRecord *)0x800AEFE0;
    u32 selected;

    asm(".set noreorder");

    g_boot_state_callbacks[0] = (BootStateCallback)boot_state_default_model;
    g_boot_state_callbacks[1] = boot_callback_01;
    g_boot_state_callbacks[2] = boot_callback_02;
    g_boot_state_callbacks[3] = boot_callback_03;
    g_boot_state_callbacks[4] = boot_callback_04;
    g_boot_state_callbacks[5] = boot_callback_05;
    g_boot_state_callbacks[6] = boot_callback_06;
    g_boot_state_callbacks[7] = boot_callback_07;
    g_boot_state_callbacks[8] = boot_callback_08;
    g_boot_state_callbacks[9] = boot_callback_09;
    g_boot_state_callbacks[10] = boot_callback_10;
    g_boot_state_callbacks[11] = boot_callback_11;
    g_boot_state_callbacks[12] = boot_callback_12;
    g_boot_state_callbacks[13] = boot_callback_13;
    g_boot_state_callbacks[14] = boot_callback_14;
    g_boot_state_callbacks[15] = boot_callback_15;
    g_boot_state_callbacks[16] = boot_callback_16;
    g_boot_state_callbacks[17] = boot_callback_17;
    g_boot_state_callbacks[18] = boot_callback_18;
    g_boot_state_callbacks[19] = boot_callback_19;
    g_boot_state_callbacks[20] = boot_callback_20;
    g_boot_state_callbacks[21] = boot_callback_21;
    g_boot_state_callbacks[22] = boot_callback_22;
    g_boot_state_callbacks[23] = boot_callback_23;
    g_boot_state_callbacks[24] = boot_callback_24;

    {
        register u16 status_busy asm("$17") = 0xFFFF;
        register u16 status_waiting asm("$18") = 0xFFFD;
        register BootTaskRecord *stack_base asm("$19") = task;
        register u32 task_depth asm("$20");

        g_boot_task_depth = 1;
        g_boot_task_head = task;
        func_00023780(task, 8);

        task_depth = 1;
        task = (BootTaskRecord *)g_boot_task_head;
        task->status = g_boot_state_input;
        if (task->status == g_boot_state_input) {
            g_boot_task_depth = task_depth;
            g_boot_task_head = stack_base;
            func_00023780(stack_base, 8);
            task = (BootTaskRecord *)g_boot_task_head;
            task->status = g_boot_state_input;
        }

    dispatch_again:
        task = (BootTaskRecord *)g_boot_task_head;
        func_00019A10();
        func_00025A10(0x5A);
        selected = task->status;
        if (selected >= 0x1F) {
            selected = 0;
        }
        g_boot_selected_callback = selected;
        g_boot_state_callbacks[selected]();
        g_boot_dispatch_result = boot_state_service_model(g_boot_selected_callback);
        g_boot_dispatch_byte = func_000065E4(g_boot_dispatch_result->mode);
        func_00006724(g_boot_dispatch_result->mode);

        if (g_boot_dispatch_result->mode < 0
            || (g_boot_selected_callback == 3
                && ((u8)(g_boot_mode_table[(u32)g_boot_mode_byte * 9] - 0x2A) < 3))) {
            func_00019D90_graph(g_boot_dispatch_result->mode);
            func_00001120((void *)0x800D7970, 0x10000);
        } else if ((g_boot_dispatch_result->mode & 0x40000000) != 0) {
            func_00019D90_graph(g_boot_dispatch_result->mode);
            func_00001120((void *)0x800DF970, 0x18000);
        } else {
            func_00019D90_graph(g_boot_dispatch_result->mode);
        }

        g_boot_service_flag = 0;
        if (g_boot_dispatch_result->on_start == 0) {
            g_boot_status = status_busy;
        } else {
            g_boot_dispatch_result->on_start();
        }
        if (((u32)func_00002D44() & 0xFF) != 0) {
            goto dispatch_done;
        }

        while (g_boot_status == status_busy || g_boot_status == status_waiting) {
            g_boot_status_progress = 0;
            func_00019D90_status((void *)0x80072398);
            g_boot_status_progress = 1;
            func_00019C50();
        }
        func_00019BC0();
        func_00019D90_status(0);
        func_00019A10();
        func_00019BC0();
        func_00019A30(1);
        if (g_boot_status == 0xFFFC) {
            goto dispatch_done;
        }

        if (g_boot_dispatch_result->on_finish != 0) {
            g_boot_dispatch_result->on_finish();
        }
        func_00003798();
        func_0000F14();

        if (g_boot_status == 0xFFFE) {
            task = (BootTaskRecord *)g_boot_task_head;
            if (task->previous == 0) {
                task->status = 0;
                goto dispatch_again;
            }
            g_boot_status = task->status;
            g_boot_task_head = task->previous;
            g_boot_task_depth--;
            goto dispatch_again;
        }

        if ((g_boot_status & 0x8000) != 0) {
            g_boot_status &= 0x7FFF;
            task = (BootTaskRecord *)g_boot_task_head;
            task->status = g_boot_status;
            goto dispatch_again;
        }

        {
            BootTaskRecord *new_task = stack_base + g_boot_task_depth;

            g_boot_task_depth++;
            g_boot_task_head = new_task;
            func_00023780(new_task, 8);
            new_task->previous = task;
            new_task->status = g_boot_status;
        }
        goto dispatch_again;

    dispatch_done:
        return;
    }
}

asm(".text\n");

asm(
    ".set noat\n"
    ".set noreorder\n"
    ".globl func_00005FC0\n"
    ".type func_00005FC0,@function\n"
    "func_00005FC0:\n"
    ".word 0x27BDFFD8\n"
    ".word 0xAFB00010\n"
    ".word 0x3C10800B\n"
    ".word 0x2610EFE0\n"
    ".word 0x02002021\n"
    ".word 0x3C028007\n"
    ".word 0x24426188\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F028\n"
    ".word 0x3C028017\n"
    ".word 0x244276C0\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F02C\n"
    ".word 0x3C028018\n"
    ".word 0x2442846C\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F030\n"
    ".word 0x3C028017\n"
    ".word 0x244236E0\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F034\n"
    ".word 0x3C028017\n"
    ".word 0x244279F8\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F038\n"
    ".word 0x3C028018\n"
    ".word 0x2442B5B0\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F03C\n"
    ".word 0x3C028018\n"
    ".word 0x2442B5BC\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F040\n"
    ".word 0x3C028018\n"
    ".word 0x2442B5E0\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F044\n"
    ".word 0x3C028018\n"
    ".word 0x244284BC\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F048\n"
    ".word 0x3C028017\n"
    ".word 0x24427D74\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F04C\n"
    ".word 0x3C028017\n"
    ".word 0x24427E4C\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F050\n"
    ".word 0x3C028017\n"
    ".word 0x24423830\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F054\n"
    ".word 0x3C028017\n"
    ".word 0x24427B78\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F058\n"
    ".word 0x3C028018\n"
    ".word 0x24428460\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F05C\n"
    ".word 0x3C028017\n"
    ".word 0x24427728\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F060\n"
    ".word 0x3C028017\n"
    ".word 0x24423920\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F064\n"
    ".word 0x3C028017\n"
    ".word 0x24427ED8\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F068\n"
    ".word 0x3C028017\n"
    ".word 0x24427F54\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F06C\n"
    ".word 0x3C028018\n"
    ".word 0x24428054\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F070\n"
    ".word 0x3C028018\n"
    ".word 0x24428060\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F074\n"
    ".word 0x3C028018\n"
    ".word 0x24428104\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F078\n"
    ".word 0x3C028017\n"
    ".word 0x244276F4\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F07C\n"
    ".word 0x3C028018\n"
    ".word 0x244282B8\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F080\n"
    ".word 0x3C028018\n"
    ".word 0x244262D0\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F084\n"
    ".word 0x3C028018\n"
    ".word 0x2442BA34\n"
    ".word 0x3C01800B\n"
    ".word 0xAC22F088\n"
    ".word 0x24020001\n"
    ".word 0xAFBF0024\n"
    ".word 0xAFB40020\n"
    ".word 0xAFB3001C\n"
    ".word 0xAFB20018\n"
    ".word 0xAFB10014\n"
    ".word 0x3C01800B\n"
    ".word 0xA022F020\n"
    ".word 0x3C01800C\n"
    ".word 0xAC304BBC\n"
    ".word 0x0C024CE0\n"
    ".word 0x24050008\n"
    ".word 0x24140001\n"
    ".word 0x02009821\n"
    ".word 0x3C03800C\n"
    ".word 0x8C634BBC\n"
    ".word 0x3C02800F\n"
    ".word 0x94428214\n"
    ".word 0x3411FFFF\n"
    ".word 0x3412FFFD\n"
    ".word 0xA4620004\n"
    ".word 0x3C02800C\n"
    ".word 0x8C424BBC\n"
    ".word 0x94430004\n"
    ".word 0x3C02800F\n"
    ".word 0x94428214\n"
    ".word 0x1462000C\n"
    ".word 0x02602021\n"
    ".word 0x3C01800B\n"
    ".word 0xA034F020\n"
    ".word 0x3C01800C\n"
    ".word 0xAC334BBC\n"
    ".word 0x0C024CE0\n"
    ".word 0x24050008\n"
    ".word 0x3C03800C\n"
    ".word 0x8C634BBC\n"
    ".word 0x3C02800F\n"
    ".word 0x94428214\n"
    ".word 0xA4620004\n"
    ".word 0x0C022684\n"
    ".word 0x00000000\n"
    ".word 0x0C025584\n"
    ".word 0x2404005A\n"
    ".word 0x3C02800C\n"
    ".word 0x8C424BBC\n"
    ".word 0x94430004\n"
    ".word 0x2C62001F\n"
    ".word 0x00021023\n"
    ".word 0x00621824\n"
    ".word 0x00031080\n"
    ".word 0x3C01800B\n"
    ".word 0x00220821\n"
    ".word 0x8C22F028\n"
    ".word 0x3C01800F\n"
    ".word 0x0040F809\n"
    ".word 0xA423810E\n"
    ".word 0x3C04800F\n"
    ".word 0x9484810E\n"
    ".word 0x3C01800F\n"
    ".word 0x0C01D854\n"
    ".word 0xAC228294\n"
    ".word 0x3C03800F\n"
    ".word 0x8C638294\n"
    ".word 0x8C640010\n"
    ".word 0x3C01800B\n"
    ".word 0x0C01D879\n"
    ".word 0xA02281FC\n"
    ".word 0x3C02800F\n"
    ".word 0x8C428294\n"
    ".word 0x0C01D8C9\n"
    ".word 0x8C440010\n"
    ".word 0x3C02800F\n"
    ".word 0x8C428294\n"
    ".word 0x8C420010\n"
    ".word 0x04400010\n"
    ".word 0x24020003\n"
    ".word 0x3C03800F\n"
    ".word 0x9463810E\n"
    ".word 0x14620014\n"
    ".word 0x00000000\n"
    ".word 0x3C028019\n"
    ".word 0x9042F481\n"
    ".word 0x000218C0\n"
    ".word 0x00621821\n"
    ".word 0x3C028019\n"
    ".word 0x00431021\n"
    ".word 0x9042F5A3\n"
    ".word 0x2442FFD6\n"
    ".word 0x2C420003\n"
    ".word 0x10400009\n"
    ".word 0x00000000\n"
    ".word 0x0C022BD8\n"
    ".word 0x3C040001\n"
    ".word 0x3C04800D\n"
    ".word 0x24847970\n"
    ".word 0x0C01C348\n"
    ".word 0x3C050001\n"
    ".word 0x0801D7CE\n"
    ".word 0x00000000\n"
    ".word 0x3C02800F\n"
    ".word 0x8C428294\n"
    ".word 0x8C420010\n"
    ".word 0x3C034000\n"
    ".word 0x00431024\n"
    ".word 0x1040000A\n"
    ".word 0x00000000\n"
    ".word 0x0C022BD8\n"
    ".word 0x34048000\n"
    ".word 0x3C04800D\n"
    ".word 0x2484F970\n"
    ".word 0x3C050001\n"
    ".word 0x0C01C348\n"
    ".word 0x34A58000\n"
    ".word 0x0801D7CE\n"
    ".word 0x00000000\n"
    ".word 0x0C022BD8\n"
    ".word 0x3C040002\n"
    ".word 0x3C02800F\n"
    ".word 0x8C428294\n"
    ".word 0x8C420000\n"
    ".word 0x3C01800C\n"
    ".word 0xA0204808\n"
    ".word 0x3C01800C\n"
    ".word 0x10400003\n"
    ".word 0xA4314C26\n"
    ".word 0x0040F809\n"
    ".word 0x00000000\n"
    ".word 0x0C01CA51\n"
    ".word 0x00000000\n"
    ".word 0x304200FF\n"
    ".word 0x14400070\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x10510005\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x14520016\n"
    ".word 0x00000000\n"
    ".word 0x3C048007\n"
    ".word 0x24842398\n"
    ".word 0x3C01800F\n"
    ".word 0xA020810C\n"
    ".word 0x3C01800C\n"
    ".word 0x0C022664\n"
    ".word 0xA0344CE4\n"
    ".word 0x0C022714\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x1051FFFD\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x1052FFF9\n"
    ".word 0x00000000\n"
    ".word 0x0C0226F0\n"
    ".word 0x00000000\n"
    ".word 0x0C022664\n"
    ".word 0x00002021\n"
    ".word 0x0C022684\n"
    ".word 0x00000000\n"
    ".word 0x0C0226F0\n"
    ".word 0x00000000\n"
    ".word 0x0C02268C\n"
    ".word 0x24040001\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x3403FFFC\n"
    ".word 0x3042FFFF\n"
    ".word 0x10430047\n"
    ".word 0x00000000\n"
    ".word 0x3C02800F\n"
    ".word 0x8C428294\n"
    ".word 0x8C42000C\n"
    ".word 0x10400003\n"
    ".word 0x00000000\n"
    ".word 0x0040F809\n"
    ".word 0x00000000\n"
    ".word 0x0C01CCE6\n"
    ".word 0x00000000\n"
    ".word 0x0C01C3C5\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x3403FFFE\n"
    ".word 0x3042FFFF\n"
    ".word 0x14430012\n"
    ".word 0x00000000\n"
    ".word 0x3C04800C\n"
    ".word 0x8C844BBC\n"
    ".word 0x8C820000\n"
    ".word 0x5040FF53\n"
    ".word 0xA4800004\n"
    ".word 0x94820004\n"
    ".word 0x3C03800B\n"
    ".word 0x9063F020\n"
    ".word 0x8C840000\n"
    ".word 0x2463FFFF\n"
    ".word 0x3C01800C\n"
    ".word 0xA4224C26\n"
    ".word 0x3C01800C\n"
    ".word 0xAC244BBC\n"
    ".word 0x3C01800B\n"
    ".word 0x0801D76E\n"
    ".word 0xA023F020\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x30428000\n"
    ".word 0x1040000C\n"
    ".word 0x00000000\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x3C03800C\n"
    ".word 0x8C634BBC\n"
    ".word 0x30427FFF\n"
    ".word 0x3C01800C\n"
    ".word 0xA4224C26\n"
    ".word 0x3C02800C\n"
    ".word 0x94424C26\n"
    ".word 0x0801D76E\n"
    ".word 0xA4620004\n"
    ".word 0x3C02800B\n"
    ".word 0x9042F020\n"
    ".word 0x3C10800C\n"
    ".word 0x8E104BBC\n"
    ".word 0x000220C0\n"
    ".word 0x00932021\n"
    ".word 0x24420001\n"
    ".word 0x3C01800B\n"
    ".word 0xA022F020\n"
    ".word 0x3C01800C\n"
    ".word 0xAC244BBC\n"
    ".word 0x0C024CE0\n"
    ".word 0x24050008\n"
    ".word 0x3C02800C\n"
    ".word 0x8C424BBC\n"
    ".word 0x3C03800C\n"
    ".word 0x94634C26\n"
    ".word 0xAC500000\n"
    ".word 0x0801D76E\n"
    ".word 0xA4430004\n"
    ".word 0x8FBF0024\n"
    ".word 0x8FB40020\n"
    ".word 0x8FB3001C\n"
    ".word 0x8FB20018\n"
    ".word 0x8FB10014\n"
    ".word 0x8FB00010\n"
    ".word 0x03E00008\n"
    ".word 0x27BD0028\n"
    "func_00006550:\n"
    ".word 0x2484FFFD\n"
    ".word 0x2C820015\n"
    ".word 0x10400008\n"
    ".word 0x00041080\n"
    ".word 0x3C01800B\n"
    ".word 0x00220821\n"
    ".word 0x8C22DF30\n"
    ".word 0x00400008\n"
    ".word 0x00000000\n"
    ".word 0x0801D860\n"
    ".word 0x00001021\n"
    ".word 0x24020001\n"
    ".word 0x03E00008\n"
    ".word 0x00000000\n"
    "func_00006588:\n"
    ".word 0x3C02800B\n"
    ".word 0x03E00008\n"
    ".word 0x2442872C\n"
    "func_00006594:\n"
    ".word 0x3402FFFE\n"
    ".word 0x3C01800C\n"
    ".word 0x03E00008\n"
    ".word 0xA4224C26\n"
    ".size func_00005FC0,1508\n"
    ".size func_00006550,56\n"
    ".size func_00006588,12\n"
    ".size func_00006594,16\n"
);
