#include "common/os_pi_manager.h"
#include "game/boot_dma_platform.h"

extern void __osResetGlobalIntMask(unsigned int);
extern void __osSetGlobalIntMask(unsigned int);
extern void osYieldThread(void);

void func_0001c2b0(void *argument)
{
    PiManager *manager = argument;
    /* The receive call writes this slot. Field accesses keep the native stack reloads. */
    void *message = 0;
    void *accessMessage;
    void *eventMessage;
    unsigned int data;
    OSPiHandle *handle;
    PiBufferView *buffer;
    PiTransferView *transfer;
    unsigned int twoPhase;
    int status;
    for (;;) {
        osRecvMesg(manager->command_queue, &message, 1);
        handle = ((DmaIoMessage *)message)->device_handle;
        if (handle && handle->type == 2 && handle->transfer.type < 2) {
            handle->transfer.field_08 = -1;
            transfer = &handle->transfer;
            buffer = &transfer->buffer[transfer->bufferIndex];
            if (handle->transfer.field_04 != 3)
                buffer->field_04 -= buffer->field_0C;
            twoPhase = 0;
            if (handle->transfer.field_04 == 2)
                twoPhase = ((OSPiHandle *)((DmaIoMessage *)message)->device_handle)->transfer.type == 0;
            osRecvMesg(manager->access_queue, &accessMessage, 1);
            __osResetGlobalIntMask(0x00100401);
            __osEPiRawWriteIo(((DmaIoMessage *)message)->device_handle, 0x05000510,
                               handle->transfer.field_10 | 0x80000000);
            /* This is one conditional retry. A C loop hoists the PI register
             * address into a saved register and changes the native frame use. */
receive_event:
            {
                osRecvMesg(manager->event_queue, &eventMessage, 1);
                handle = ((DmaIoMessage *)message)->device_handle;
                transfer = &handle->transfer;
                buffer = &transfer->buffer[transfer->bufferIndex];
                if (buffer->field_00 == 0x1D) {
                    __osEPiRawWriteIo(handle, 0x05000510, handle->transfer.field_10 | 0x10000000);
                    __osEPiRawWriteIo(((DmaIoMessage *)message)->device_handle, 0x05000510,
                                       handle->transfer.field_10);
                    __osEPiRawReadIo(((DmaIoMessage *)message)->device_handle, 0x05000508, &data);
                    if (data & 0x02000000)
                        __osEPiRawWriteIo(((DmaIoMessage *)message)->device_handle, 0x05000510,
                                           handle->transfer.field_10 | 0x01000000);
                    buffer->field_00 = 4;
                    *(volatile unsigned int *)0xA4600010 = 2;
                    __osSetGlobalIntMask(0x00100C01);
                }
                osSendMesg(((DmaIoMessage *)message)->return_queue, message, 0);
                if (twoPhase == 1) {
                    twoPhase = 0;
                    if (((OSPiHandle *)((DmaIoMessage *)message)->device_handle)->transfer.buffer[0].field_00 == 0)
                        goto receive_event;
                }
            }
            osSendMesg(manager->access_queue, 0, 0);
            if (((OSPiHandle *)((DmaIoMessage *)message)->device_handle)->transfer.bufferIndex == 1)
                osYieldThread();
            continue;
        }
        switch (((DmaIoMessage *)message)->type) {
        case 11:
            osRecvMesg(manager->access_queue, &accessMessage, 1);
            status = manager->dma(0, ((DmaIoMessage *)message)->device_address,
                                   ((DmaIoMessage *)message)->dram_address, ((DmaIoMessage *)message)->size);
            break;
        case 12:
            osRecvMesg(manager->access_queue, &accessMessage, 1);
            status = manager->dma(1, ((DmaIoMessage *)message)->device_address,
                                   ((DmaIoMessage *)message)->dram_address, ((DmaIoMessage *)message)->size);
            break;
        case 15:
            osRecvMesg(manager->access_queue, &accessMessage, 1);
            status = manager->epi_dma(((DmaIoMessage *)message)->device_handle, 0,
                                       ((DmaIoMessage *)message)->device_address, ((DmaIoMessage *)message)->dram_address, ((DmaIoMessage *)message)->size);
            break;
        case 16:
            osRecvMesg(manager->access_queue, &accessMessage, 1);
            status = manager->epi_dma(((DmaIoMessage *)message)->device_handle, 1,
                                       ((DmaIoMessage *)message)->device_address, ((DmaIoMessage *)message)->dram_address, ((DmaIoMessage *)message)->size);
            break;
        case 10:
            osSendMesg(((DmaIoMessage *)message)->return_queue, message, 0);
            /* This request does not start a DMA operation. */
        default:
            status = -1;
            break;
        }
        if (status == 0) {
            osRecvMesg(manager->event_queue, &eventMessage, 1);
            osSendMesg(((DmaIoMessage *)message)->return_queue, message, 0);
            osSendMesg(manager->access_queue, 0, 0);
        }
    }
}
