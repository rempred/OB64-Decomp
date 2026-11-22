#include "common/os_message_queue.h"
#include "common/os_pi_handle.h"

typedef void *OSMesg;
extern MessageQueue D_800BE030;
extern OSMesg D_800BE048[];
extern OSPiHandle *D_800E7A20;
void func_0001bcc0(int priority, MessageQueue *queue, void **messages, int count);
void func_0001a340(void) {
    func_0001bcc0(150, &D_800BE030, D_800BE048, 50);
    D_800E7A20 = func_0001c130();
}
