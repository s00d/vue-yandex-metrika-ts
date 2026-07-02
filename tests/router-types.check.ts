/**
 * Compile-only: vue-router instances must be assignable to optional Config.router.
 */
import type { Router as Router4 } from 'vue-router'
import type VueRouter3 from 'vue-router3'
import type { Config } from '../src/types'

declare const router4: Router4
declare const router3: VueRouter3

const config4: Config = { id: '1' }
const config3: Config = { id: '1' }
const withRouter4: Config = { id: '1', router: router4 }
const withRouter3: Config = { id: '1', router: router3 }

void config4
void config3
void withRouter4
void withRouter3
