#ifndef OB64_GAME_BOOT_COMMAND_STREAM_H
#define OB64_GAME_BOOT_COMMAND_STREAM_H

/* The first word selects a resource. The remaining command words vary by operation. */
void *boot_command_stream_dispatch(unsigned int key, ...);
void *func_0000978C(unsigned int key, ...);

/* Cleanup commands share the resource-key prefix and consume optional words. */
void boot_command_stream_resource_node_dispatch(unsigned int resourceKey, ...);
void func_80079618(unsigned int resourceKey, ...);
void D_80079618(unsigned int resourceKey, ...);

#endif
