// Copyright 2023 Jesse G. Donat

// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file or at
// https://opensource.org/licenses/MIT.

const drake = (R: number, fp: number, ne: number, fl: number, fi: number, fc: number, L: number) => R * fp * ne * fl * fi * fc * L;

class DrakeMaker {
	public constructor(
		protected R: HTMLInputElement,
		protected fp: HTMLInputElement,
		protected ne: HTMLInputElement,
		protected fl: HTMLInputElement,
		protected fi: HTMLInputElement,
		protected fc: HTMLInputElement,
		protected L: HTMLInputElement,
		protected N: HTMLInputElement
	) {
		const inputs = this.inputs();

		const change = () => {
			let valid = true;
			for (const i of inputs) {
				if (!i.checkValidity()) {
					valid = false;
					i.classList.add("is-invalid");
				} else {
					i.classList.remove("is-invalid");
				}
			}

			if (!valid) {
				return;
			}

			this.drakeItUp();
		}

		for (const i of inputs) {
			i.addEventListener("keyup", change);
			i.addEventListener("change", change);
			i.addEventListener("input", change);
		}

		this.drakeItUp();
	}

	protected inputs(): HTMLInputElement[] {
		return [
			this.R,
			this.fp,
			this.ne,
			this.fl,
			this.fi,
			this.fc,
			this.L
		];
	}

	protected drakeItUp() {
		const N = drake(
			parseFloat(this.R.value),
			parseFloat(this.fp.value),
			parseFloat(this.ne.value),
			parseFloat(this.fl.value),
			parseFloat(this.fi.value),
			parseFloat(this.fc.value),
			parseFloat(this.L.value)
		);

		this.N.value = String(N);//.toExponential().replace(/0+$/, "");
	}
}