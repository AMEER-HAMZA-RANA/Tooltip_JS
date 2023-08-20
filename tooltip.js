import globalEventListener from "./utils/globalEventListener";
const tooltipContainer = document.createElement("div");
tooltipContainer.classList.add("tooltip-container");
document.body.appendChild(tooltipContainer);

const DEFAULT_SPACING = 5;
const POSITION_ORDER = ["top", "bottom", "left", "right"];
const POSITION_TO_FUNCTION_MAP = {
  top: positionTooltipTop,
  bottom: positionTooltipBottom,
  left: positionTooltipLeft,
  right: positionTooltipRight,
};

globalEventListener("mouseover", "[data-tooltip]", (e) => {
  const tooltip = createTooltipElement(e.target.dataset.tooltip);
  tooltipContainer.appendChild(tooltip);
  positionTooltip(tooltip, e.target);

  const arrow = createArrow();
  tooltipContainer.appendChild(arrow);
  positionArrow(arrow, tooltip, e.target);

  e.target.addEventListener(
    "mouseleave",
    () => {
      tooltip.remove();
      arrow.remove();
    },
    { once: true }
  );
});

function createTooltipElement(text) {
  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerText = text;
  return tooltip;
}

function createArrow() {
  const arrow = document.createElement("span");
  arrow.classList.add("tooltip-arrow");
  arrow.innerText = "|";
  return arrow;
}

function positionTooltip(tooltip, element) {
  const elementRect = element.getBoundingClientRect();

  const spacing = parseInt(element.dataset.spacing) || DEFAULT_SPACING;

  const positions = (element.dataset.positions || "")
    .split("|")
    .concat(POSITION_ORDER);

  for (let i = 0; i < positions.length; i++) {
    const tooltipPositionRender = POSITION_TO_FUNCTION_MAP[positions[i]];
    if (
      tooltipPositionRender &&
      tooltipPositionRender(tooltip, elementRect, spacing)
    )
      return;
  }
}

function positionArrow(arrow, tooltip, element) {
  const elementRect = element.getBoundingClientRect();
  const arrowRect = arrow.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  arrow.style.top = `${elementRect.top - arrowRect.height}px`;
  arrow.style.left = `${elementRect.left + elementRect.width / 2}px`;

  if (tooltipRect.top < elementRect.top) {
    arrow.style.left = `${elementRect.left + elementRect.width / 2}px`;
    arrow.style.transform = "rotate(0deg)";
    arrow.style.top = `${elementRect.top - arrowRect.height}px`;
  }

  if (
    (tooltipRect.bottom > elementRect.top &&
      tooltipRect.right - tooltipRect.width / 2 >
        elementRect.right - elementRect.width / 2 &&
      tooltipRect.left < elementRect.right) ||
    (tooltipRect.bottom > elementRect.top &&
      tooltipRect.right - tooltipRect.width / 2 <
        elementRect.right - elementRect.width / 2 &&
      tooltipRect.left < elementRect.right)
  ) {
    arrow.style.left = `${elementRect.left + elementRect.width / 2}px`;
    arrow.style.transform = "rotate(0deg)";
    arrow.style.top = `${elementRect.top + arrowRect.height}px`;
  }

  if (
    tooltipRect.left > elementRect.right &&
    element.dataset.positions.includes("right")
  ) {
    arrow.style.left = `${tooltipRect.left}px`;
    arrow.style.transform = "rotate(90deg)";
    arrow.style.top = `${
      elementRect.top - elementRect.height + tooltipRect.height / 2
    }px`;
  }
  if (
    tooltipRect.left < elementRect.right &&
    element.dataset.positions.includes("left")
  ) {
    arrow.style.left = `${tooltipRect.right}px`;
    arrow.style.transform = "rotate(90deg)";
    arrow.style.top = `${
      elementRect.top - elementRect.height + tooltipRect.height / 2
    }px`;
  }

  if (tooltipRect.bottom < elementRect.top) {
    arrow.style.left = `${elementRect.left + elementRect.width / 2}px`;
    arrow.style.transform = "rotate(0deg)";
    arrow.style.top = `${elementRect.top - arrowRect.height}px`;
  }

  if (
    tooltipRect.bottom > elementRect.top &&
    tooltipRect.right - tooltipRect.width / 2 >
      elementRect.right - elementRect.width / 2 &&
    tooltipRect.left < elementRect.right
  ) {
    arrow.style.left = `${elementRect.left + elementRect.width / 2}px`;
    arrow.style.transform = "rotate(0deg)";
    arrow.style.top = `${elementRect.top + arrowRect.height}px`;
  }
}

function positionTooltipTop(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.style.top = `${elementRect.top - tooltipRect.height - spacing}px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  let bound = isOutOfBounds(tooltip, spacing);

  if (bound.top) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bound.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bound.left) {
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipBottom(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.style.top = `${elementRect.bottom + spacing}px`;
  tooltip.style.left = `${
    elementRect.left + elementRect.width / 2 - tooltipRect.width / 2
  }px`;

  let bound = isOutOfBounds(tooltip, spacing);

  if (bound.bottom) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bound.right) {
    tooltip.style.right = `${spacing}px`;
    tooltip.style.left = "initial";
  }
  if (bound.left) {
    tooltip.style.left = `${spacing}px`;
  }
  return true;
}

function positionTooltipRight(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${elementRect.right + spacing}px`;

  let bound = isOutOfBounds(tooltip, spacing);

  if (bound.right) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bound.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bound.top) {
    tooltip.style.top = `${spacing}px`;
  }
  return true;
}

function positionTooltipLeft(tooltip, elementRect, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  tooltip.style.top = `${
    elementRect.top + elementRect.height / 2 - tooltipRect.height / 2
  }px`;
  tooltip.style.left = `${elementRect.left - tooltipRect.width - spacing}px`;

  let bound = isOutOfBounds(tooltip, spacing);

  if (bound.left) {
    resetTooltipPosition(tooltip);
    return false;
  }
  if (bound.bottom) {
    tooltip.style.bottom = `${spacing}px`;
    tooltip.style.top = "initial";
  }
  if (bound.top) {
    tooltip.style.top = `${spacing}px`;
  }
  return true;
}

function isOutOfBounds(tooltip, spacing) {
  const tooltipRect = tooltip.getBoundingClientRect();
  const tooltipContainerRect = tooltipContainer.getBoundingClientRect();

  return {
    left: tooltipRect.left <= tooltipContainerRect.left + spacing,
    right: tooltipRect.right >= tooltipContainerRect.right - spacing,
    top: tooltipRect.top <= tooltipContainerRect.top + spacing,
    bottom: tooltipRect.bottom >= tooltipContainerRect.bottom - spacing,
  };
}

function resetTooltipPosition(tooltip) {
  (tooltip.style.left = "initial"),
    (tooltip.style.right = "initial"),
    (tooltip.style.top = "initial"),
    (tooltip.style.bottom = "initial");
}
