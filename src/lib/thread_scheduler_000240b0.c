/* Complete scheduler producer ROM240B0..24AC0, independently reconstructed.
 * Queue/thread blocks and task-header gaps describe only observed offsets.
 * Original writable storage remains external; no second data copy is emitted.
 * Complete functions use the existing whole-producer group's GLOBAL binding.
 */
#include "common/event_message.h"
#include "common/os_message_queue.h"
#include "common/os_thread.h"

typedef struct Task Task;
typedef struct Client Client;
typedef struct Scheduler Scheduler;
typedef struct { unsigned char bytes[80]; } ViMode;
typedef struct SpTaskView {
    unsigned int type;
    unsigned int flags;
    void *field_08;
    unsigned int field_0C;
    void *field_10;
    unsigned int field_14;
    void *field_18;
    unsigned int field_1C;
    void *field_20;
    unsigned int field_24;
    void *outputBuffer;
    unsigned long long *outputSize;
    void *field_30;
    unsigned int field_34;
    void *field_38;
    unsigned int field_3C;
} SpTaskView;
struct Task {
    Task *next;
    unsigned int state;
    unsigned int flags;
    void *framebuffer;
    SpTaskView work;
    MessageQueue *queue;
    void *message;
};
struct Client { Client *next; MessageQueue *queue; };
struct Scheduler {
    unsigned short retrace_message;
    unsigned char unknown_02[0x1E];
    unsigned short prenmi_message;
    unsigned char unknown_22[0x1E];
    MessageQueue interrupt_queue;
    void *interrupt_messages[8];
    MessageQueue command_queue;
    void *command_messages[8];
    Thread thread;
    Client *clients;
    Task *audio_head;
    Task *graphics_head;
    Task *audio_tail;
    Task *graphics_tail;
    Task *rsp_task;
    Task *rdp_task;
    unsigned int retraces;
    int do_audio;
};
extern ViMode osViModeTable[];
extern int D_800AA774;
extern int D_800AA778;
extern int D_800AA77C;
extern void osCreateViManager(int);
extern void osViSetMode(void *);
extern void osViBlack(unsigned char);
extern void osViSetEvent(void *, void *, unsigned int);
extern unsigned int osSetIntMask(unsigned int);
extern unsigned int osSpTaskYielded(SpTaskView *);
extern void *osViGetCurrentFramebuffer(void);
extern void *osViGetNextFramebuffer(void);
extern void osViSwapBuffer(void *);
extern void osWritebackDCacheAll(void);
extern void osSpTaskLoad(SpTaskView *);
extern void osSpTaskStartGo(SpTaskView *);
extern int osDpSetNextBuffer(void *, unsigned long long);
extern void osSpTaskYield(void);
void func_000242e8(void *);
void func_000243ec(Scheduler *);
void func_000244ec(Scheduler *);
void func_000245dc(Scheduler *);
int func_000246C0(Scheduler *, Task *);
void func_0002474C(Scheduler *, Task *);
void func_000247a4(Scheduler *, Task *, Task *);
void func_00024874(Scheduler *);
int func_000248ac(Scheduler *, Task **, Task **, int);

void func_000240b0(Scheduler *sc, void *stack, int priority,
                       unsigned char mode, unsigned char retrace_count)
{
    sc->retrace_message = 1;
    sc->rsp_task = 0;
    sc->rdp_task = 0;
    sc->clients = 0;
    sc->retraces = 0;
    sc->audio_head = 0;
    sc->graphics_head = 0;
    sc->audio_tail = 0;
    sc->graphics_tail = 0;
    sc->prenmi_message = 4;
    osCreateMesgQueue(&sc->interrupt_queue, sc->interrupt_messages, 8);
    osCreateMesgQueue(&sc->command_queue, sc->command_messages, 8);
    osCreateViManager(254);
    osViSetMode(&osViModeTable[mode]);
    osViBlack(1);
    osSetEventMesg(4, &sc->interrupt_queue, (void *)0x29B);
    osSetEventMesg(9, &sc->interrupt_queue, (void *)0x29C);
    osSetEventMesg(14, &sc->interrupt_queue, (void *)0x29D);
    osViSetEvent(&sc->interrupt_queue, (void *)0x29A, retrace_count);
    osCreateThread(&sc->thread, 4, func_000242e8, sc, stack, priority);
    osStartThread(&sc->thread);
}

void func_000241f8(Scheduler *sc, Client *client, MessageQueue *queue)
{
    unsigned int mask = osSetIntMask(1);
    client->queue = queue;
    client->next = sc->clients;
    sc->clients = client;
    osSetIntMask(mask);
}

void func_00024250(Scheduler *sc, Client *client)
{
    Client *current = sc->clients;
    Client *previous = 0;
    unsigned int mask = osSetIntMask(1);
    while (current != 0) {
        if (current == client) {
            if (previous != 0)
                previous->next = current->next;
            else
                sc->clients = current->next;
            break;
        }
        previous = current;
        current = current->next;
    }
    osSetIntMask(mask);
}

MessageQueue *func_000242e0(Scheduler *scheduler)
{
    return &scheduler->command_queue;
}

void func_000242e8(void *argument)
{
    Scheduler *sc = argument;
    void *message;
    Client *client;
    for (;;) {
        osRecvMesg(&sc->interrupt_queue, &message, 1);
        switch ((int)message) {
        case 0x29A: func_000243ec(sc); break;
        case 0x29B: func_000244ec(sc); break;
        case 0x29C: func_000245dc(sc); break;
        case 0x29D:
            for (client = sc->clients; client != 0; client = client->next)
                osSendMesg(client->queue, &sc->prenmi_message, 0);
            break;
        }
    }
}

void func_000243ec(Scheduler *sc)
{
    void *message;
    Task *rsp = 0;
    Task *rdp = 0;
    int available;
    Client *client;
    sc->retraces++;
    while (osRecvMesg(&sc->command_queue, &message, 0) != -1)
        func_0002474C(sc, message);
    if (sc->do_audio && sc->rsp_task != 0)
        func_00024874(sc);
    else {
        available = (sc->rsp_task == 0) << 1;
        if (sc->rdp_task == 0)
            available |= 1;
        if (func_000248ac(sc, &rsp, &rdp, available) != available)
            func_000247a4(sc, rsp, rdp);
    }
    for (client = sc->clients; client != 0; client = client->next)
        osSendMesg(client->queue, &sc->retrace_message, 0);
}

void func_000244ec(Scheduler *sc)
{
    Task *task = sc->rsp_task;
    Task *rsp = 0;
    Task *rdp = 0;
    int available;
    sc->rsp_task = 0;
    if ((task->state & 0x10) && osSpTaskYielded(&task->work)) {
        task->state |= 0x20;
        if ((task->flags & 7) == 3) {
            task->next = sc->graphics_head;
            sc->graphics_head = task;
            if (sc->graphics_tail == 0)
                sc->graphics_tail = task;
        }
    } else {
        task->state &= ~2;
        func_000246C0(sc, task);
    }
    available = (sc->rsp_task == 0) << 1;
    if (sc->rdp_task == 0)
        available |= 1;
    if (func_000248ac(sc, &rsp, &rdp, available) != available)
        func_000247a4(sc, rsp, rdp);
}

void func_000245dc(Scheduler *sc)
{
    Task *task = sc->rdp_task;
    Task *rsp = 0;
    Task *rdp = 0;
    int available;
    sc->rdp_task = 0;
    task->state &= ~1;
    func_000246C0(sc, task);
    available = (sc->rsp_task == 0) << 1;
    if (sc->rdp_task == 0)
        available |= 1;
    if (func_000248ac(sc, &rsp, &rdp, available) != available)
        func_000247a4(sc, rsp, rdp);
}

__inline__ Task *func_0002466c(Task *task)
{
    if (task != 0)
        return osViGetCurrentFramebuffer() == osViGetNextFramebuffer() ? task : 0;
    return 0;
}

int func_000246C0(Scheduler *sc, Task *task)
{
    if ((task->state & 3) == 0) {
        osSendMesg(task->queue, task->message, 1);
        if (task->work.type == 1 && (task->flags & 0x60) == 0x60) {
            if (D_800AA77C) {
                osViBlack(0);
                D_800AA77C = 0;
            }
            osViSwapBuffer(task->framebuffer);
        }
        return 1;
    }
    return 0;
}

void func_0002474C(Scheduler *sc, Task *task)
{
    if (task->work.type == 2) {
        if (sc->audio_tail != 0)
            sc->audio_tail->next = task;
        else
            sc->audio_head = task;
        sc->audio_tail = task;
        sc->do_audio = 1;
    } else {
        if (sc->graphics_tail != 0)
            sc->graphics_tail->next = task;
        else
            sc->graphics_head = task;
        sc->graphics_tail = task;
    }
    task->next = 0;
    task->state = task->flags & 3;
}

void func_000247a4(Scheduler *sc, Task *rsp, Task *rdp)
{
    if (rsp != 0) {
        if (rsp->work.type == 2)
            osWritebackDCacheAll();
        rsp->state &= ~0x30;
        osSpTaskLoad(&rsp->work);
        osSpTaskStartGo(&rsp->work);
        sc->rsp_task = rsp;
        if (rsp == rdp)
            sc->rdp_task = rdp;
    }
    if (rdp != 0 && rdp != rsp) {
        osDpSetNextBuffer(rdp->work.outputBuffer, *rdp->work.outputSize);
        D_800AA774 = 1;
        D_800AA778 = 0;
        sc->rdp_task = rdp;
    }
}

void func_00024874(Scheduler *sc)
{
    if (sc->rsp_task->work.type == 1) {
        sc->rsp_task->state |= 0x10;
        osSpTaskYield();
    }
}

int func_000248ac(Scheduler *sc, Task **rsp, Task **rdp, int available)
{
    int original = available;
    Task *graphics = sc->graphics_head;
    Task *audio = sc->audio_head;
    if (sc->do_audio && (available & 2)) {
        if (graphics != 0 && (graphics->flags & 0x10)) {
            *rsp = graphics;
            available &= ~2;
        } else {
            *rsp = audio;
            sc->do_audio = 0;
            available &= ~2;
            sc->audio_head = sc->audio_head->next;
            if (sc->audio_head == 0)
                sc->audio_tail = 0;
        }
    } else if (func_0002466c(graphics) != 0) {
        switch (graphics->flags & 7) {
        case 3:
            if (graphics->state & 0x20) {
                if (available & 2) {
                    *rsp = graphics;
                    available &= ~2;
                    if (graphics->state & 1) {
                        *rdp = graphics;
                        available &= ~1;
                    }
                    sc->graphics_head = sc->graphics_head->next;
                    if (sc->graphics_head == 0)
                        sc->graphics_tail = 0;
                }
            } else if (available == 3) {
                *rsp = *rdp = graphics;
                available = 0;
                sc->graphics_head = sc->graphics_head->next;
                if (sc->graphics_head == 0)
                    sc->graphics_tail = 0;
            }
            break;
        case 1:
            break;
        case 2:
        case 6:
        case 7:
            if (graphics->state & 2) {
                if (available & 2) {
                    *rsp = graphics;
                    available &= ~2;
                }
            } else if (graphics->state & 1) {
                if (available & 1) {
                    *rdp = graphics;
                    available &= ~1;
                    sc->graphics_head = sc->graphics_head->next;
                    if (sc->graphics_head == 0)
                        sc->graphics_tail = 0;
                }
            }
            break;
        }
    }
    if (available != original)
        available = func_000248ac(sc, rsp, rdp, available);
    return available;
}
