<?php declare(strict_types=1);
$data_id = generate_random_string(8);
?>

<section class="section--container section--intro">
    <?php
    render_partial(
        'components/component-title', 
        array(
            "titleContent" => "Install"
        )
    );
    ?>
    <h3 class="h-b f11y-white weight-600">Install with npm</h3>
    <pre id="pre-js-<?=$data_id?>">
        <code class="language-javascript">
            npm install f11y
        </code>
    </pre>
    <br>
    <br>
    <h3 class="h-b f11y-white weight-600">via CDN / Script Tag</h3>
    <pre id="pre-js-<?=$data_id?>">
<code class="language-markup no-whitespace-normalization"><!--    </footer>
    <script src="https://www.unpkg.com/f11y@latest/umd/f11y.min.js"></script>
</body>--></code></pre>
</section>