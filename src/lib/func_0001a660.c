#include "common/os_message_queue.h"
#include "game/nu_si_message.h"

typedef signed char s8;
typedef unsigned char u8;
typedef signed short s16;
typedef unsigned short u16;
typedef signed int s32;
typedef unsigned int u32;
typedef unsigned long long u64;
typedef void *OSMesg;
typedef MessageQueue OSMesgQueue;
typedef struct {
    u16 type;
    u8 status;
    u8 errno;
} OSContStatus;
extern OSMesgQueue D_800C4A00;
extern OSMesg D_800BE190;
extern OSMesgQueue D_800E9BF0;
extern OSMesg D_800BE194;
extern NUCallBackList D_800A9FF8;
extern u32 D_800C6D60;
extern OSContStatus D_800C4B38[4];
void func_0001a9d0(void);

void func_0001aa40(void);
u8 func_0001a660(void) {
    s32 cnt;
    u8 pattern;
    u8 bitmask;
    func_0001a9d0();
    osCreateMesgQueue(&D_800C4A00, &D_800BE190, 1);
    osCreateMesgQueue(&D_800E9BF0, &D_800BE194, 1);
    func_0001b530(&D_800A9FF8);
    func_0001aa40();
    bitmask = 1;
    pattern = 0;
    D_800C6D60 = 0;
    for (cnt = 0; cnt < 4; cnt++) {
        if (D_800C4B38[cnt].errno) {
            continue;
        }
        if ((D_800C4B38[cnt].type & 0x1F07) == 5) {
            pattern |= bitmask;
            D_800C6D60++;
        }
        bitmask <<= 1;
    }
    return pattern;
}
